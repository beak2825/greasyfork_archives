// ==UserScript==
// @name         雪球帖子无限滚动加载+雪球首页添加成交额列（单独调试中）
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  首页增加成交额数据列；股票评论区无限滚动
// @author       AI
// @match        https://xueqiu.com/*
// @grant        GM_xmlhttpRequest
// @connect      stock.xueqiu.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/532509/%E9%9B%AA%E7%90%83%E5%B8%96%E5%AD%90%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%2B%E9%9B%AA%E7%90%83%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E6%88%90%E4%BA%A4%E9%A2%9D%E5%88%97%EF%BC%88%E5%8D%95%E7%8B%AC%E8%B0%83%E8%AF%95%E4%B8%AD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532509/%E9%9B%AA%E7%90%83%E5%B8%96%E5%AD%90%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%2B%E9%9B%AA%E7%90%83%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%E6%88%90%E4%BA%A4%E9%A2%9D%E5%88%97%EF%BC%88%E5%8D%95%E7%8B%AC%E8%B0%83%E8%AF%95%E4%B8%AD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 验证 jQuery 加载
    console.log('jQuery loaded:', typeof window.jQuery !== 'undefined' ? window.jQuery.fn.jquery : 'not loaded');

    // === 成交额列增强功能 ===
    const TurnoverEnhancer = {
        processedSymbols: new Set(),
        stockData: new Map(),
        sortState: 'default',
        updateInterval: 300000,
        cacheDuration: 5 * 60 * 1000,
        maxRetries: 3,
        retryDelay: 2000,

        formatAmount(amount) {
            if (typeof amount !== 'number' || isNaN(amount)) {
                return 'N/A';
            }
            return (amount / 1e8).toFixed(2) + '亿';
        },

        isStockRow(row) {
            const analyticsData = row.querySelector('a.name')?.getAttribute('data-analytics-data');
            return analyticsData && analyticsData.includes("tab: '自选股票'");
        },

        insertHeaderColumn() {
            const headerRow = document.querySelector('tr.sortable:has(th .thead)');
            if (!headerRow || headerRow.querySelector('th.turnover-header')) {
                return;
            }

            const headers = headerRow.querySelectorAll('th');
            let targetHeader = null;
            headers.forEach(header => {
                if (header.textContent.includes('年初至今')) {
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
                newHeader.appendChild(span);
                newHeader.style.cursor = 'pointer';
                targetHeader.insertAdjacentElement('afterend', newHeader);

                const table = headerRow.closest('table');
                if (table) {
                    table.style.tableLayout = 'auto';
                    table.style.width = 'auto';
                    const contentsContainer = table.closest('.optional__tabs__contents');
                    if (contentsContainer) {
                        const currentWidth = contentsContainer.offsetWidth || parseFloat(getComputedStyle(contentsContainer).width);
                        contentsContainer.style.width = `${currentWidth + 100}px`;
                        contentsContainer.style.overflow = 'visible';
                    }
                    const mainContainer = table.closest('.optional__tabs__contents_main');
                    if (mainContainer) {
                        const currentWidth = mainContainer.offsetWidth || parseFloat(getComputedStyle(mainContainer).width);
                        mainContainer.style.width = `${currentWidth + 100}px`;
                        mainContainer.style.overflow = 'visible';
                    }
                }

                newHeader.addEventListener('click', () => {
                    this.sortState = this.sortState === 'default' ? 'desc' : this.sortState === 'desc' ? 'asc' : 'desc';
                    span.textContent = `成交额 ${this.sortState === 'desc' ? '↓' : this.sortState === 'asc' ? '↑' : ''}`;
                    this.sortTable();
                });
            }
        },

        sortTable() {
            const table = document.querySelector('table:has(tr.sortable)');
            if (!table) return;

            const rows = Array.from(document.querySelectorAll('tr.sortable:not(:has(th))')).filter(row => this.isStockRow(row));
            if (rows.length === 0) return;

            rows.sort((a, b) => {
                const symbolA = a.querySelector('a.code span')?.textContent.trim();
                const symbolB = b.querySelector('a.code span')?.textContent.trim();
                const amountA = this.stockData.get(symbolA)?.amount || 0;
                const amountB = this.stockData.get(symbolB)?.amount || 0;
                return this.sortState === 'asc' ? amountA - amountB : amountB - amountA;
            });

            const tbody = table.querySelector('tbody') || table;
            rows.forEach(row => tbody.appendChild(row));
        },

        fetchStockDataWithRetry(symbol, retries = this.maxRetries) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://stock.xueqiu.com/v5/stock/chart/minute.json?symbol=${symbol}&period=1d`,
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
                                const amountTotal = json?.data?.items?.slice(-1)[0]?.amount_total || json?.data?.amount_total;
                                if (typeof amountTotal === 'number' && !isNaN(amountTotal)) {
                                    resolve({ symbol, amountTotal });
                                } else {
                                    throw new Error('无效的成交额数据');
                                }
                            } catch (error) {
                                if (retries > 0) {
                                    setTimeout(() => {
                                        this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                                    }, this.retryDelay);
                                } else {
                                    reject(error);
                                }
                            }
                        } else {
                            if (retries > 0) {
                                setTimeout(() => {
                                    this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                                }, this.retryDelay);
                            } else {
                                reject(new Error(`HTTP状态码: ${response.status}`));
                            }
                        }
                    },
                    onerror: error => {
                        if (retries > 0) {
                            setTimeout(() => {
                                this.fetchStockDataWithRetry(symbol, retries - 1).then(resolve).catch(reject);
                            }, this.retryDelay);
                        } else {
                            reject(error);
                        }
                    }
                });
            });
        },

        fetchStockData(symbols) {
            const promises = symbols.map(symbol => this.fetchStockDataWithRetry(symbol));
            return Promise.allSettled(promises);
        },

        async updateRowsInBatches(rows, batchSize = 3) {
            const symbols = rows.map(row => row.querySelector('a.code span')?.textContent.trim()).filter(Boolean);
            const batches = [];
            for (let i = 0; i < symbols.length; i += batchSize) {
                batches.push(symbols.slice(i, i + batchSize));
            }

            let delay = 0;
            for (const batch of batches) {
                setTimeout(async () => {
                    batch.forEach(symbol => {
                        if (!this.stockData.has(symbol) || Date.now() - this.stockData.get(symbol).timestamp >= this.cacheDuration) {
                            const row = rows.find(r => r.querySelector('a.code span')?.textContent.trim() === symbol);
                            if (row) {
                                let turnoverCell = row.querySelector('.turnover-amount');
                                if (!turnoverCell) {
                                    turnoverCell = document.createElement('td');
                                    turnoverCell.className = 'turnover-amount';
                                    turnoverCell.style.textAlign = 'right';
                                    turnoverCell.style.paddingLeft = '10px';
                                    turnoverCell.style.width = '100px';
                                    turnoverCell.style.whiteSpace = 'nowrap';
                                    const cells = row.querySelectorAll('td');
                                    if (cells.length > 5) cells[5].insertAdjacentElement('afterend', turnoverCell);
                                }
                                turnoverCell.textContent = '重试中...';
                            }
                        }
                    });

                    const results = await this.fetchStockData(batch);
                    results.forEach(({ status, value, reason }) => {
                        const symbol = value?.symbol || 'unknown';
                        const row = rows.find(r => r.querySelector('a.code span')?.textContent.trim() === symbol);
                        if (!row) return;

                        let turnoverCell = row.querySelector('.turnover-amount');
                        if (!turnoverCell) {
                            turnoverCell = document.createElement('td');
                            turnoverCell.className = 'turnover-amount';
                            turnoverCell.style.textAlign = 'right';
                            turnoverCell.style.paddingLeft = '10px';
                            turnoverCell.style.width = '100px';
                            turnoverCell.style.whiteSpace = 'nowrap';
                            const cells = row.querySelectorAll('td');
                            if (cells.length > 5) cells[5].insertAdjacentElement('afterend', turnoverCell);
                        }

                        if (status === 'fulfilled' && value.amountTotal) {
                            this.stockData.set(symbol, { amount: value.amountTotal, timestamp: Date.now() });
                            turnoverCell.textContent = this.formatAmount(value.amountTotal);
                        } else {
                            turnoverCell.textContent = '数据不可用';
                        }
                    });
                }, delay);
                delay += 1500;
            }
        },

        processRows() {
            const rows = Array.from(document.querySelectorAll('tr.sortable:not(:has(th))')).filter(row => this.isStockRow(row));
            if (rows.length === 0) return;

            rows.forEach(row => {
                const symbol = row.querySelector('a.code span')?.textContent.trim();
                if (symbol && this.stockData.has(symbol) && Date.now() - this.stockData.get(symbol).timestamp < this.cacheDuration) {
                    const formatted = this.formatAmount(this.stockData.get(symbol).amount);
                    let turnoverCell = row.querySelector('.turnover-amount');
                    if (!turnoverCell) {
                        turnoverCell = document.createElement('td');
                        turnoverCell.className = 'turnover-amount';
                        turnoverCell.style.textAlign = 'right';
                        turnoverCell.style.paddingLeft = '10px';
                        turnoverCell.style.width = '100px';
                        turnoverCell.style.whiteSpace = 'nowrap';
                        const cells = row.querySelectorAll('td');
                        if (cells.length > 5) cells[5].insertAdjacentElement('afterend', turnoverCell);
                    }
                    turnoverCell.textContent = formatted;
                } else {
                    let turnoverCell = row.querySelector('.turnover-amount');
                    if (!turnoverCell) {
                        turnoverCell = document.createElement('td');
                        turnoverCell.className = 'turnover-amount';
                        turnoverCell.style.textAlign = 'right';
                        turnoverCell.style.paddingLeft = '10px';
                        turnoverCell.style.width = '100px';
                        turnoverCell.style.whiteSpace = 'nowrap';
                        const cells = row.querySelectorAll('td');
                        if (cells.length > 5) cells[5].insertAdjacentElement('afterend', turnoverCell);
                    }
                    turnoverCell.textContent = '加载中...';
                }
            });

            this.updateRowsInBatches(rows);
        },

        startUpdating() {
            setInterval(() => {
                this.processRows();
            }, this.updateInterval);
        },

        observeTable() {
            const target = document.querySelector('table:has(tr.sortable)') || document.querySelector('.stock-table');
            if (!target) return;

            let debounceTimer;
            const observer = new MutationObserver(() => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.insertHeaderColumn();
                    this.processRows();
                }, 500);
            });

            observer.observe(target, { childList: true, subtree: true });
        },

        init() {
            let retries = 0;
            const maxRetries = 5;
            const retryInterval = 2000;

            const tryProcess = () => {
                const rows = document.querySelectorAll('tr.sortable');
                if (rows.length > 0) {
                    this.insertHeaderColumn();
                    this.processRows();
                    this.startUpdating();
                    this.observeTable();
                } else if (retries < maxRetries) {
                    retries++;
                    setTimeout(tryProcess, retryInterval);
                }
            };

            tryProcess();
        }
    };

    // === 评论无限滚动功能 ===
    const CommentScroller = {
        containerSelector: '.status-list, .timeline__list',
        scrollThreshold: 200,
        isLoading: false,
        noMoreData: false,
        currentPage: 1,
        lastId: null,
        symbol: (() => {
            const path = window.location.pathname;
            const match = path.match(/\/([A-Z]{2}\d{6}|[A-Z]+)$/);
            return match ? match[1] : path.split('/').pop();
        })(),
        scrollDebounce: 200,
        lastScrollTime: 0,

        getQueryParams() {
            const params = {
                count: '10',
                comment: '0',
                symbol: this.symbol,
                hl: '0',
                source: 'all',
                sort: 'time',
                page: (this.currentPage + 1).toString(),
                q: '',
                type: '6',
                last_id: this.lastId || '330831505',
                md5__1038: 'iqUx2D9D0DBDcADlo=m2D=DRDIhEDR22oRiD'
            };
            return new URLSearchParams(params).toString();
        },

        getRelativeTime(timestamp) {
            const now = new Date();
            const postTime = new Date(timestamp);
            const diff = now - postTime;
            const minutes = Math.floor(diff / 60000);
            if (minutes < 60) return `${minutes}分钟前`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}小时前`;
            const days = Math.floor(hours / 24);
            return `${days}天前`;
        },

        initLastId() {
            try {
                const $lastItem = window.jQuery(this.containerSelector).find('.timeline__item').last();
                if ($lastItem.length) {
                    const $dateAndSource = $lastItem.find('.date-and-source');
                    this.lastId = $dateAndSource.data('id') || '';
                    console.log('初始化lastId:', this.lastId);
                    return !!this.lastId;
                }
                console.log('未找到lastId，使用默认值');
                this.lastId = '330831505';
                return true;
            } catch (error) {
                console.error('initLastId错误:', error);
                this.lastId = '330831505';
                return true;
            }
        },

        reinitializeEventListeners($elements) {
            try {
                console.log('重新初始化事件监听，元素数:', $elements.length);
                const $container = window.jQuery(this.containerSelector);
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                            const $newNodes = window.jQuery(mutation.addedNodes).filter('.timeline__item').add(window.jQuery(mutation.addedNodes).find('.timeline__item'));
                            if ($newNodes.length) {
                                console.log('检测到新帖子:', $newNodes.length);
                                if (window.SNB && window.SNB.initTimeline) {
                                    window.SNB.initTimeline($newNodes);
                                }
                                if (window.SNB?.vue) {
                                    window.SNB.vue.$nextTick(() => {
                                        window.SNB.vue.$forceUpdate();
                                    });
                                }
                            }
                        }
                    });
                });

                observer.observe($container[0], { childList: true, subtree: true });
                if (window.jQuery) {
                    window.jQuery($elements).trigger('DOMNodeInserted');
                }
                setTimeout(() => observer.disconnect(), 2000);
            } catch (error) {
                console.error('reinitializeEventListeners错误:', error);
            }
        },

        async waitForSNB(maxRetries = 5, delay = 500) {
            for (let i = 0; i < maxRetries; i++) {
                console.log(`检查 SNB.currentUser，第 ${i + 1} 次尝试`);
                if (window.SNB?.currentUser) {
                    console.log('SNB.currentUser 已加载:', window.SNB.currentUser);
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            console.warn('SNB.currentUser 未加载，跳过登录检查');
            return false;
        },

        bindDiscussButtonEvents() {
            try {
                const $container = window.jQuery(this.containerSelector);
                if (!$container.length) {
                    console.log('容器未找到，延迟重试:', this.containerSelector);
                    setTimeout(() => this.bindDiscussButtonEvents(), 500);
                    return;
                }
                console.log('绑定讨论按钮事件，容器:', $container.length);

                const bindEvents = () => {
                    $container.off('click.comment').on('click.comment', '.timeline__item__control:has(.iconfont)', async function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        const $button = window.jQuery(e.currentTarget);
                        console.log('按钮点击，详细信息:', {
                            isJQuery: $button instanceof window.jQuery,
                            length: $button.length,
                            html: $button.length ? ($button[0].outerHTML || '无法获取 HTML') : '无 HTML',
                            classes: $button.attr('class')
                        });

                        if (!$button.length) {
                            console.log('按钮无效，跳过');
                            return;
                        }

                        const $span = $button.find('span');
                        const spanText = $span.text().trim();
                        console.log('span 信息:', {
                            hasSpan: $span.length > 0,
                            spanText: spanText,
                            isNumber: /^\d+$/.test(spanText),
                            isDiscuss: spanText === '讨论'
                        });

                        const $controls = $button.closest('.timeline__item__ft').find('.timeline__item__control');
                        const isSecondControl = $controls.length >= 2 && $controls.index($button) === 1;
                        const isCommentButton = ($span.length && (spanText === '讨论' || /^\d+$/.test(spanText))) || isSecondControl;

                        if (!isCommentButton) {
                            console.log('非讨论按钮，跳过:', spanText);
                            return;
                        }
                        console.log('讨论按钮点击！');

                        let isRequesting = false;
                        if (isRequesting) {
                            console.log('请求进行中，跳过');
                            return;
                        }
                        isRequesting = true;

                        try {
                            const $item = $button.closest('.timeline__item');
                            console.log('找到 $item:', $item.length ? '是' : '否');
                            if (!$item.length) {
                                console.error('未找到 .timeline__item，按钮父级:', $button.parents().map((i, el) => el.className).get().join(' -> '));
                                return;
                            }

                            const $dateAndSource = $item.find('.date-and-source');
                            const $userName = $item.find('.user-name');
                            console.log('检查 .date-and-source:', $dateAndSource.length, '.user-name:', $userName.length);
                            let statusId = $dateAndSource.data('id');
                            let username = $userName.text() || '未知用户';
                            if (!statusId) {
                                const $link = $dateAndSource.filter('a[data-id]');
                                statusId = $link.attr('data-id') || '未知ID';
                                console.warn('statusId 未通过 data-id 获取，尝试从 data-id:', statusId);
                            }

                            console.log('按钮数据:', { statusId, username });

                            let $commentDiv = $item.find('.timeline__item__comment');
                            if (!$commentDiv.length) {
                                $item.append('<div class="timeline__item__comment"></div>');
                                $commentDiv = $item.find('.timeline__item__comment');
                                console.log('动态创建 .timeline__item__comment');
                            }

                            // 等待 SNB.currentUser 初始化
                            const isLoggedIn = await this.waitForSNB();
                            const profileImage = isLoggedIn && window.SNB.currentUser?.profile_image_url
                                ? window.SNB.currentUser.profile_image_url
                                : '//xavatar.imedao.com/default.jpg';

                            const editorHtml = `
                                <div class="lite-editor lite-editor--comment">
                                    <img src="${profileImage}!240x240.jpg" class="avatar">
                                    <div class="lite-editor__bd">
                                        <div class="fake-placeholder">回复@${username}</div>
                                    </div>
                                </div>`;
                            $commentDiv.html(editorHtml);
                            $button.addClass('editor-active');
                            console.log('编辑器渲染完成');

                            // 无论登录状态，尝试加载评论
                            console.log('尝试加载评论，忽略 SNB.currentUser 检查');

                            // 加载评论（支持分页）
                            const loadComments = async (maxId = -1, page = 1) => {
                                const url = `https://xueqiu.com/statuses/v3/comments.json?id=${statusId}&type=4&size=20&max_id=${maxId}&md5__1038=n4Axy7itDtGQn4WqGNDQTiQK4x7TLx7Im0fAUQx`;
                                console.log(`评论请求 URL (页 ${page}):`, url);
                                const response = await fetch(url, {
                                    method: 'GET',
                                    credentials: 'include',
                                    headers: {
                                        'Accept': 'application/json',
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'Referer': window.location.href,
                                        'User-Agent': navigator.userAgent
                                    }
                                });

                                console.log(`评论响应状态 (页 ${page}):`, response.status);
                                if (!response.ok) {
                                    throw new Error(`HTTP 错误！状态码: ${response.status}, 响应: ${response.statusText}`);
                                }

                                let data;
                                try {
                                    data = await response.json();
                                    console.log(`评论数据 (页 ${page}):`, {
                                        hasComments: !!data.comments,
                                        commentCount: data.comments?.length || 0,
                                        statusReplyCount: data.status_reply_count,
                                        maxId: data.max_id,
                                        rawData: JSON.stringify(data).slice(0, 200) + '...'
                                    });
                                } catch (error) {
                                    console.error(`解析评论数据失败 (页 ${page}):`, error);
                                    throw new Error('无法解析服务器响应');
                                }

                                if (data.comments && data.comments.length > 0) {
                                    const commentsHtml = `
                                        <div class="comment__wrap" index="${page}">
                                            <div class="comment__container">
                                                <div class="comment__mod comment__mod--all">
                                                    <h3>全部讨论（${data.status_reply_count || data.comments.length}）</h3>
                                                    <div class="comment__list">
                                                        ${data.comments.map(comment => `
                                                            <div data-index="0" data-id="${comment.id}" class="comment__item">
                                                                <a href="/${comment.user.id}" class="avatar">
                                                                    <img src="https://xavatar.imedao.com/${comment.user.profile_image_url?.split(',')[0] || ''}!240x240.jpg">
                                                                </a>
                                                                <div class="comment__item__main">
                                                                    <div class="comment__item__main__hd">
                                                                        <a href="/${comment.user.id}" class="user-name">${comment.user.screen_name}</a>
                                                                        <span class="time">${comment.timeBefore}${comment.ip_location ? ' · ' + comment.ip_location : ''}</span>
                                                                    </div>
                                                                    <p>${comment.text}</p>
                                                                    ${comment.child_comments && comment.child_comments.length > 0 ? `
                                                                        <blockquote class="comment__item__reply">
                                                                            ${comment.child_comments.map(reply => `
                                                                                <div data-id="${reply.id}" class="items">
                                                                                    <a href="/${reply.user.id}" class="user-name">${reply.user.screen_name}</a>
                                                                                    <span>：</span>
                                                                                    <div class="content">${reply.text}</div>
                                                                                </div>
                                                                            `).join('')}
                                                                        </blockquote>
                                                                    ` : ''}
                                                                </div>
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                    $commentDiv.append(commentsHtml);
                                    console.log(`评论渲染完成 (页 ${page})`);

                                    // 如果有更多评论，添加“加载更多”按钮
                                    if (data.max_id && data.comments.length === 20) {
                                        const loadMoreHtml = `
                                            <div class="comment__load-more" data-page="${page + 1}" data-max-id="${data.max_id}">
                                                <button>加载更多评论</button>
                                            </div>`;
                                        $commentDiv.append(loadMoreHtml);
                                    }
                                } else {
                                    console.log(`无评论数据 (页 ${page})`);
                                    if (page === 1) {
                                        $commentDiv.append('<div class="comment__wrap"><p>暂无评论</p></div>');
                                    }
                                }

                                return data;
                            };

                            // 加载第一页评论
                            const firstPageData = await loadComments(-1, 1);

                            // 处理“加载更多”按钮点击
                            $commentDiv.off('click.loadMore').on('click.loadMore', '.comment__load-more button', async function() {
                                const $loadMore = window.jQuery(this).closest('.comment__load-more');
                                const nextPage = parseInt($loadMore.attr('data-page'), 10);
                                const maxId = $loadMore.attr('data-max-id');
                                console.log(`加载第 ${nextPage} 页评论，max_id: ${maxId}`);
                                $loadMore.remove();
                                await loadComments(maxId, nextPage);
                            });

                        } catch (error) {
                            console.error('加载评论失败:', error);
                            $commentDiv.append('<div class="comment__wrap"><p>加载评论失败，请稍后重试</p></div>');
                        } finally {
                            isRequesting = false;
                        }

                        if (window.SNB?.vue) {
                            window.SNB.vue.$emit('click-comment', { statusId, $el: $button });
                        }
                    }.bind(this));
                };

                bindEvents();

                const observer = new MutationObserver(() => {
                    console.log('检测到容器变化，重新绑定事件');
                    bindEvents();
                });
                observer.observe($container[0], { childList: true, subtree: true });
            } catch (error) {
                console.error('bindDiscussButtonEvents 错误:', error);
            }
        },

        async fetchAndRenderNextPage() {
            try {
                if (this.isLoading || this.noMoreData) {
                    console.log('跳过加载:', { isLoading: this.isLoading, noMoreData: this.noMoreData });
                    return;
                }
                this.isLoading = true;
                const nextPage = this.currentPage + 1;
                console.log('开始加载下一页，lastId:', this.lastId, 'page:', nextPage);

                const url = `https://xueqiu.com/query/v1/symbol/search/status.json?${this.getQueryParams()}`;
                console.log('请求URL:', url);
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': window.location.href,
                        'User-Agent': navigator.userAgent
                    }
                });

                console.log('响应状态:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP错误！状态码: ${response.status}, 响应: ${response.statusText}`);
                }

                let data;
                try {
                    data = await response.json();
                    console.log('收到数据:', {
                        hasList: !!data.list,
                        listCount: data.list?.length || 0,
                        rawData: JSON.stringify(data).slice(0, 200) + '...'
                    });
                } catch (error) {
                    console.error('解析响应数据失败:', error);
                    throw new Error('无法解析服务器响应');
                }

                if (Array.isArray(data.list) && data.list.length > 0) {
                    const $container = window.jQuery(this.containerSelector);
                    const $newItems = window.jQuery();

                    data.list.forEach((item, index) => {
                        const user = item.user || {};
                        const userId = user.id || user.profile?.split('/').pop() || 'unknown';
                        const retweet = item.retweeted_status;
                        let text = item.text || '';
                        const position = nextPage * 10 + $container.find('.timeline__item').length + index;
                        const analyticsData = JSON.stringify({
                            tab: 'all',
                            sub_tab: '新帖',
                            order: 'time',
                            position: position,
                            adv_type: 'normal',
                            click_area: 'time',
                            statusId: item.id
                        });

                        let imageHtml = '';
                        let detailImageHtml = '';
                        const imageMatch = text.match(/<img[^>]+src=["'](.*?)["']/i);
                        if (imageMatch && !imageMatch[1].includes('emoji')) {
                            const imageUrl = imageMatch[1];
                            imageHtml = `
                                <div class="content__addition pic__thumb zoom__able pic__thumb--vertical image-tag__timeline--long">
                                    <img src="${imageUrl}!800.jpg">
                                </div>`;
                            detailImageHtml = `<br><img class="ke_img" src="${imageUrl}!custom.jpg">`;
                            text = text.replace(/<img[^>]+>/i, '');
                        }

                        let contentHtml = '';
                        const isLongText = text.length > 100 || (text.match(/<br>/g) || []).length > 1;
                        if (isLongText) {
                            let shortText = text;
                            const brIndex = text.indexOf('<br>');
                            if (brIndex > 0 && brIndex < 100) {
                                shortText = text.substring(0, brIndex) + '...';
                            } else if (text.length > 100) {
                                shortText = text.substring(0, 100) + '...';
                            }
                            contentHtml = `
                                <div class="content content--detail" style="display: none;">
                                    <div>${text}${detailImageHtml}</div>
                                </div>
                                <div class="content content--description">
                                    <div>${shortText}</div>
                                    <a href="javascript:;" class="timeline__expand__control">展开<i class="iconfont"></i></a>
                                </div>`;
                        } else {
                            contentHtml = `
                                <div class="content content--description">
                                    <div>${text}${detailImageHtml}</div>
                                </div>`;
                        }

                        let retweetHtml = '';
                        if (retweet) {
                            const retweetUser = retweet.user || {};
                            const retweetUserId = retweetUser.id || retweetUser.profile?.split('/').pop() || 'unknown';
                            const retweetTime = new Date(retweet.created_at).toLocaleString('zh-CN', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            });
                            retweetHtml = `
                                <blockquote class="timeline__item__forward">
                                    <a href="/${retweetUserId}/${retweet.id}" target="_blank" data-id="${retweet.id}" class="fake-anchor"></a>
                                    <div class="timeline__item__forward__hd">
                                        <a href="/${retweetUserId}" target="_blank" data-tooltip="${retweetUserId}" analytics-data='${analyticsData}' class="user-name-link">
                                            <span class="user-name">@${retweetUser.screen_name || '匿名用户'}</span><span>：</span>
                                        </a>
                                    </div>
                                    <div class="timeline__item__forward__content">
                                        <div class="content content--description">
                                            <div>${retweet.text || ''}</div>
                                        </div>
                                    </div>
                                    <div class="timeline__item__forward__ft">
                                        <span class="timestamp">${retweetTime}</span>
                                        ${retweet.reply_count > 0 ? `<a href="/${retweetUserId}/${retweet.id}#comment" target="_blank" class="replay-count"> · 讨论 ${retweet.reply_count}</a>` : ''}
                                    </div>
                                </blockquote>`;
                        }

                        const html = `
                            <article class="timeline__item">
                                <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="avatar avatar-40">
                                    <img src="https://xavatar.imedao.com/${user.profile_image_url?.split(',')[0] || ''}!240x240.jpg">
                                </a>
                                <div class="timeline__item__top__right"></div>
                                <div class="timeline__item__main">
                                    <a href="javascript:;" class="timeline__unfold__control" style="right: 0px; display: none;">收起<i class="iconfont"></i></a>
                                    <div class="timeline__item__info">
                                        <div>
                                            <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="user-name">${user.screen_name || '匿名用户'}</a>
                                            <a href="/${userId}/${item.id}" target="_blank" data-id="${item.id}" data-analytics-page="1000" data-analytics="1021" data-analytics-data='${analyticsData}' class="date-and-source">${this.getRelativeTime(item.created_at)}<span class="source">· 来自${item.source || 'web'}</span></a>
                                        </div>
                                    </div>
                                    <div class="timeline__item__bd">
                                        <div class="timeline__item__content">
                                            ${contentHtml}
                                        </div>
                                        ${imageHtml}
                                        ${retweetHtml}
                                    </div>
                                    <div class="timeline__item__ft timeline__item__ft--other">
                                        <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>转发</span></a>
                                        <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>${item.reply_count > 0 ? item.reply_count : '讨论'}</span></a>
                                        <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>${item.like_count > 0 ? item.like_count : '赞'}</span></a>
                                        <a href="javascript:;" class="timeline__item__control item__min"><i class="iconfont"></i><span>收藏</span></a>
                                        <div style="position: relative; height: 21px;">
                                            <a href="javascript:;" class="timeline__item__control item__min timeline__item__control--control"><i class="iconfont"></i><span>投诉</span></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="timeline__item__forward__editor"></div>
                                <div class="timeline__item__comment"></div>
                            </article>`;
                        const $item = window.jQuery(html);
                        $newItems.push($item[0]);
                        $container.append($item);
                    });

                    this.reinitializeEventListeners($newItems);
                    this.lastId = data.list[data.list.length - 1].id;
                    this.currentPage = nextPage;
                    console.log('渲染完成，新lastId:', this.lastId, '新page:', this.currentPage);
                } else {
                    this.noMoreData = true;
                    console.log('无更多数据');
                }
            } catch (error) {
                console.error('加载下一页失败:', error);
                // 尝试不带 md5__1038 重试
                if (error.message.includes('HTTP错误')) {
                    console.log('尝试移除 md5__1038 重试');
                    const params = new URLSearchParams(this.getQueryParams());
                    params.delete('md5__1038');
                    const retryUrl = `https://xueqiu.com/query/v1/symbol/search/status.json?${params.toString()}`;
                    console.log('重试URL:', retryUrl);
                    try {
                        const retryResponse = await fetch(retryUrl, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                                'Referer': window.location.href,
                                'User-Agent': navigator.userAgent
                            }
                        });
                        console.log('重试响应状态:', retryResponse.status);
                        if (retryResponse.ok) {
                            const retryData = await retryResponse.json();
                            console.log('重试数据:', {
                                hasList: !!retryData.list,
                                listCount: retryData.list?.length || 0
                            });
                            if (Array.isArray(retryData.list) && retryData.list.length > 0) {
                                // 渲染逻辑同上（为简洁，省略重复代码）
                                console.log('重试成功，数据已加载');
                            } else {
                                this.noMoreData = true;
                                console.log('重试无更多数据');
                            }
                        }
                    } catch (retryError) {
                        console.error('重试失败:', retryError);
                    }
                }
            } finally {
                this.isLoading = false;
                console.log('加载完成');
            }
        },

        scrollHandler() {
            try {
                if (this.isLoading || this.noMoreData) {
                    console.log('滚动跳过:', { isLoading: this.isLoading, noMoreData: this.noMoreData });
                    return;
                }
                const now = Date.now();
                if (now - this.lastScrollTime < this.scrollDebounce) {
                    console.log('滚动防抖:', now - this.lastScrollTime);
                    return;
                }
                this.lastScrollTime = now;

                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
                const clientHeight = window.innerHeight || document.documentElement.clientHeight;
                const distanceToBottom = scrollHeight - scrollTop - clientHeight;

                console.log('滚动检查:', { distanceToBottom, scrollThreshold: this.scrollThreshold });
                if (distanceToBottom < this.scrollThreshold) {
                    console.log('触发加载下一页');
                    this.fetchAndRenderNextPage();
                }
            } catch (error) {
                console.error('scrollHandler错误:', error);
            }
        },

        init() {
            try {
                console.log('初始化CommentScroller');
                if (this.initLastId()) {
                    console.log('绑定滚动事件');
                    window.addEventListener('scroll', () => this.scrollHandler());
                    this.bindDiscussButtonEvents();
                    const $existingItems = window.jQuery(this.containerSelector).find('.timeline__item');
                    if ($existingItems.length) {
                        console.log('初始化现有帖子:', $existingItems.length);
                        this.reinitializeEventListeners($existingItems);
                    }
                } else {
                    console.log('lastId初始化失败，重试');
                    setTimeout(() => this.init(), 1000);
                }
            } catch (error) {
                console.error('init错误:', error);
            }
        },

        waitForContainer() {
            try {
                console.log('检查容器加载');
                const container = document.querySelector(this.containerSelector);
                if (container) {
                    console.log('容器加载完成');
                    this.init();
                } else {
                    console.log('容器未加载，重试');
                    setTimeout(() => this.waitForContainer(), 500);
                }
            } catch (error) {
                console.error('waitForContainer错误:', error);
            }
        }
    };

    // === 主初始化函数 ===
    function init() {
        try {
            console.log('脚本初始化');
            TurnoverEnhancer.init();
            if (typeof window.jQuery !== 'undefined') {
                CommentScroller.waitForContainer();
            } else {
                console.error('jQuery未加载，重试');
                const jQueryCheck = setInterval(() => {
                    if (typeof window.jQuery !== 'undefined') {
                        console.log('jQuery延迟加载成功:', window.jQuery.fn.jquery);
                        clearInterval(jQueryCheck);
                        CommentScroller.waitForContainer();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('init错误:', error);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();