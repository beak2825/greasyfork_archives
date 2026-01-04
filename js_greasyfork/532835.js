// ==UserScript==
// @name         雪球显示成交额
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  在雪球自选股页面添加成交额数据列，初始显示缓存，定期更新，支持分组切换
// @author       AI
// @match        https://xueqiu.com/?*
// @grant        GM_xmlhttpRequest
// @connect      stock.xueqiu.com
// @downloadURL https://update.greasyfork.org/scripts/532835/%E9%9B%AA%E7%90%83%E6%98%BE%E7%A4%BA%E6%88%90%E4%BA%A4%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/532835/%E9%9B%AA%E7%90%83%E6%98%BE%E7%A4%BA%E6%88%90%E4%BA%A4%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TurnoverEnhancer = {
        stockData: new Map(),
        updateInterval: 30000,
        cacheDuration: 24 * 60 * 60 * 1000,
        maxRetries: 3,
        retryDelay: 2000,
        batchSize: 5,
        lastFetchDate: null,
        lastFetchTime: 0,
        fetchCooldown: 0,
        observer: null,
        isInitialLoad: true,
        updateTimer: null,
        isHeaderInserted: false,

        setMiddleColumnWidth() {
            const middleCol = document.querySelector('div.user__col--middle');
            if (middleCol) {
                middleCol.style.width = '780px';
            }
        },

        observeMiddleColumn() {
            const target = document.body;
            if (!target) return;

            const observer = new MutationObserver(() => {
                this.setMiddleColumnWidth();
            });
            observer.observe(target, { childList: true, subtree: true });
        },

        loadCache() {
            try {
                const cached = localStorage.getItem('xueqiu_turnover_cache');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    for (const [symbol, data] of Object.entries(parsed)) {
                        this.stockData.set(symbol, data);
                    }
                }
                this.lastFetchDate = localStorage.getItem('xueqiu_last_fetch_date') || new Date().toDateString();
            } catch (error) {
                this.lastFetchDate = new Date().toDateString();
            }
        },

        saveCache() {
            try {
                const cacheObj = {};
                for (const [symbol, data] of this.stockData) {
                    cacheObj[symbol] = data;
                }
                localStorage.setItem('xueqiu_turnover_cache', JSON.stringify(cacheObj));
                localStorage.setItem('xueqiu_last_fetch_date', new Date().toDateString());
            } catch (error) {}
        },

        formatAmount(amount) {
            if (typeof amount !== 'number' || isNaN(amount) || amount === null) {
                return '--';
            }
            if (amount < 1e4) return amount.toFixed(2) + '元';
            else if (amount < 1e8) return (amount / 1e4).toFixed(2) + '万';
            else return (amount / 1e8).toFixed(2) + '亿';
        },

        isStockRow(row) {
            const codeElement = row.querySelector('a.code span, td.code a span, td a[href*="/S/"] span');
            return !!codeElement && !!codeElement.textContent.trim();
        },

        insertHeaderColumn() {
            if (this.isHeaderInserted) return true;

            const headerRow = document.querySelector('tr.sortable:has(th .thead), tr:has(th .thead_name), tr:has(th)');
            if (!headerRow) return false;
            if (headerRow.querySelector('th.turnover-header')) {
                this.isHeaderInserted = true;
                return true;
            }

            const headers = headerRow.querySelectorAll('th');
            let targetHeader = null;
            headers.forEach(header => {
                const text = header.textContent.trim();
                if (text.includes('年初至今') || text.includes('涨跌幅') || text.includes('现价')) {
                    targetHeader = header;
                }
            });

            if (targetHeader) {
                const newHeader = document.createElement('th');
                newHeader.className = 'turnover-header';
                newHeader.style.width = '100px';
                newHeader.style.textAlign = 'right';
                newHeader.style.whiteSpace = 'nowrap';
                const span = document.createElement('span');
                span.className = 'thead';
                span.textContent = '成交额';
                const icon = document.createElement('i');
                icon.className = 'iconimg icon-custom icon-sort';
                newHeader.appendChild(span);
                newHeader.appendChild(icon);
                targetHeader.insertAdjacentElement('afterend', newHeader);
                this.isHeaderInserted = true;
                return true;
            }
            return false;
        },

        fetchStockDataWithRetry(symbol, retries = this.maxRetries) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://stock.xueqiu.com/v5/stock/quote.json?symbol=${symbol.toUpperCase()}&extend=detail`,
                    headers: {
                        'Accept': 'application/json',
                        'Cookie': document.cookie,
                        'User-Agent': navigator.userAgent,
                        'Referer': 'https://xueqiu.com/',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: response => {
                        if (response.status === 200) {
                            try {
                                const json = JSON.parse(response.responseText);
                                const amountTotal = json?.data?.quote?.amount ?? null;
                                resolve({ symbol, amountTotal });
                            } catch (error) {
                                if (retries > 0) {
                                    setTimeout(() => {
                                        this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                                    }, this.retryDelay);
                                } else {
                                    resolve({ symbol, amountTotal: null });
                                }
                            }
                        } else {
                            if (retries > 0) {
                                setTimeout(() => {
                                    this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                                }, this.retryDelay);
                            } else {
                                resolve({ symbol, amountTotal: null });
                            }
                        }
                    },
                    onerror: error => {
                        if (retries > 0) {
                            setTimeout(() => {
                                this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                            }, this.retryDelay);
                        } else {
                            resolve({ symbol, amountTotal: null });
                        }
                    }
                });
            });
        },

        fetchStockData(symbols) {
            const now = Date.now();
            if (now - this.lastFetchTime < this.fetchCooldown) {
                return Promise.resolve(symbols.map(symbol => ({
                    status: 'fulfilled',
                    value: { symbol, amountTotal: this.stockData.get(symbol)?.amount || null }
                })));
            }
            this.lastFetchTime = now;
            const promises = symbols.map(symbol => this.fetchStockDataWithRetry(symbol));
            return Promise.allSettled(promises);
        },

        ensureTurnoverCells(rows) {
            rows.forEach(row => {
                const symbol = row.querySelector('a.code span, td.code a span, td a[href*="/S/"] span')?.textContent.trim();
                if (!symbol) return;

                let turnoverCell = row.querySelector('.turnover-amount');
                if (!turnoverCell) {
                    turnoverCell = document.createElement('td');
                    turnoverCell.className = 'turnover-amount';
                    turnoverCell.style.textAlign = 'right';
                    turnoverCell.style.paddingLeft = '10px';
                    turnoverCell.style.width = '100px';
                    turnoverCell.style.whiteSpace = 'nowrap';
                    const cells = row.querySelectorAll('td');
                    let inserted = false;
                    cells.forEach((cell, index) => {
                        if (cell.querySelector('a.optional__dropdown, a[href*="javascript:void(0)"]')) {
                            cells[index].insertAdjacentElement('beforebegin', turnoverCell);
                            inserted = true;
                        }
                    });
                    if (!inserted && cells.length > 0) {
                        cells.forEach((cell, index) => {
                            const text = cell.textContent.trim();
                            if (text.includes('年初至今') || text.includes('涨跌幅') || text.includes('现价')) {
                                cells[index].insertAdjacentElement('afterend', turnoverCell);
                                inserted = true;
                            }
                        });
                    }
                    if (!inserted && cells.length > 0) {
                        cells[cells.length - 1].insertAdjacentElement('beforebegin', turnoverCell);
                    }
                }

                turnoverCell.textContent = this.stockData.has(symbol) ? this.formatAmount(this.stockData.get(symbol).amount) : '--';
            });
        },

        processRows(isInitialLoad = false) {
            const rows = Array.from(document.querySelectorAll('tr.sortable:not(:has(th)), tr:not(:has(th))')).filter(row => this.isStockRow(row));
            if (rows.length === 0) return;

            this.ensureTurnoverCells(rows);
            if (isInitialLoad) return;

            const symbols = rows
                .map(row => row.querySelector('a.code span, td.code a span, td a[href*="/S/"] span')?.textContent.trim())
                .filter(symbol => symbol);

            if (symbols.length === 0) return;

            this.fetchStockData(symbols).then(results => {
                results.forEach(({ status, value }) => {
                    const symbol = value?.symbol || 'unknown';
                    const row = rows.find(r => r.querySelector('a.code span, td.code a span, td a[href*="/S/"] span')?.textContent.trim() === symbol);
                    if (!row) return;

                    this.ensureTurnoverCells([row]);

                    const turnoverCell = row.querySelector('.turnover-amount');
                    if (status === 'fulfilled' && value.amountTotal !== null) {
                        this.stockData.set(symbol, { amount: value.amountTotal, timestamp: Date.now() });
                        turnoverCell.textContent = this.formatAmount(value.amountTotal);
                        this.saveCache();
                    } else if (this.stockData.has(symbol)) {
                        turnoverCell.textContent = this.formatAmount(this.stockData.get(symbol).amount);
                    } else {
                        turnoverCell.textContent = '--';
                    }
                });
            });
        },

        startUpdating() {
            if (this.updateTimer) clearInterval(this.updateTimer);
            this.updateTimer = setInterval(() => {
                const rows = Array.from(document.querySelectorAll('tr.sortable:not(:has(th)), tr:not(:has(th))')).filter(row => this.isStockRow(row));
                if (rows.length > 0) {
                    this.processRows(false);
                }
            }, this.updateInterval);
        },

        observeTable() {
            const target = document.querySelector('.optional__tb, .optional__tabs__contents, .stock-table__wrap, .stock-table__container, table:has(tr.sortable), table.stock-table, table.table');
            if (!target) return;

            if (this.observer) this.observer.disconnect();

            let debounceTimer;
            this.observer = new MutationObserver(mutations => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (this.isInitialLoad) {
                        this.insertHeaderColumn();
                        this.processRows(true);
                        this.isInitialLoad = false;
                    } else {
                        this.processRows(false);
                    }
                }, 1000);
            });

            this.observer.observe(target, { childList: true, subtree: true });
        },

        init() {
            this.loadCache();
            this.setMiddleColumnWidth();
            this.observeMiddleColumn();

            const tryProcess = (attempt = 1, maxAttempts = 10) => {
                const rows = document.querySelectorAll('tr.sortable:not(:has(th)), tr:not(:has(th))');
                const stockRows = Array.from(rows).filter(row => this.isStockRow(row));
                if (stockRows.length > 0) {
                    this.insertHeaderColumn();
                    this.processRows(true);
                    this.startUpdating();
                    this.observeTable();
                    this.isInitialLoad = false;
                } else if (attempt < maxAttempts) {
                    setTimeout(() => tryProcess(attempt + 1, maxAttempts), 1000);
                } else {
                    this.startUpdating();
                    this.observeTable();
                }
            };

            tryProcess();

            window.forceFetchTurnoverData = () => {
                this.stockData.clear();
                localStorage.removeItem('xueqiu_turnover_cache');
                localStorage.removeItem('xueqiu_last_fetch_date');
                this.lastFetchDate = null;
                this.lastFetchTime = 0;
                this.isInitialLoad = true;
                this.processRows(true);
            };
        }
    };

    function init() {
        try {
            TurnoverEnhancer.init();
        } catch (error) {}
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    }
})();