// ==UserScript==
// @name         Tdcc 投票小幫手
// @namespace    https://github.com/zxc88645/TdccAuto/blob/main/TdccAuto.js
// @version      1.7.13
// @description  自動電子投票，並且快速將結果保存成 JPG
// @author       Owen
// @match        https://stockservices.tdcc.com.tw/*
// @icon         https://raw.githubusercontent.com/zxc88645/TdccAuto/refs/heads/main/img/TdccAuto_icon.png
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license      MIT
// @homepage     https://github.com/zxc88645/TdccAuto
// @downloadURL https://update.greasyfork.org/scripts/530187/Tdcc%20%E6%8A%95%E7%A5%A8%E5%B0%8F%E5%B9%AB%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530187/Tdcc%20%E6%8A%95%E7%A5%A8%E5%B0%8F%E5%B9%AB%E6%89%8B.meta.js
// ==/UserScript==

/* global html2pdf html2canvas voteObj */

(function () {
    'use strict';

    // 儲存股票代號的 key 與快取
    const SAVED_KEY = 'savedStocks2';
    let savedStocks = GM_getValue(SAVED_KEY, {});
    let idNo = null;

    // 非投票頁面時，預先取得戶號
    if (!window.location.pathname.includes('/evote/shareholder/001/')) {
        fetchAndParseIdNO().then(_idNo => {
            idNo = _idNo;
        });
    }

    // 輸出所有帳號的已保存股票
    console.log('[所有帳號的已保存股票]');
    for (const [_idNo, stocks] of Object.entries(savedStocks)) {
        if (Array.isArray(stocks)) {
            console.log(`戶號 ${_idNo}：${stocks.join(', ')}`);
        } else {
            delete savedStocks[_idNo]; // 移除舊格式資料
            GM_setValue(SAVED_KEY, savedStocks); // 更新儲存
        }
    }

    /**
     * 延遲指定毫秒
     * @param {number} ms - 毫秒
     * @returns {Promise<void>}
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 判斷選擇器是否為 XPath
     * @param {string} selector
     * @returns {boolean}
     */
    function isXPath(selector) {
        return selector.startsWith('/') || selector.startsWith('(');
    }

    /**
     * 查詢 DOM 元素，支援 CSS 選擇器與 XPath
     * @param {string} selector - CSS 選擇器或 XPath
     * @param {Element} [context=document] - 查詢範圍
     * @returns {Element|null} - 匹配的 DOM 元素
     */
    function querySelector(selector, context = document) {
        return isXPath(selector)
            ? document.evaluate(selector, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
            : context.querySelector(selector);
    }

    /**
     * 點擊指定元素並等待
     * @param {string|Element} target - CSS 選擇器、XPath 或 DOM 元素
     * @param {string} [expectedText=null] - 預期文字
     * @param {string} [logInfo=null] - 日誌標籤
     * @returns {Promise<boolean>}
     */
    async function clickAndWait(target, expectedText = null, logInfo = null) {
        try {
            const element = typeof target === 'string' ? querySelector(target) : target;
            if (!element) {
                console.warn(`[未找到] ${target}`);
                return false;
            }

            if (expectedText && element.innerText.trim() !== expectedText) {
                console.warn(`[文字不匹配] 預期: '${expectedText}'，但實際為: '${element.innerText.trim()}'`);
                return false;
            }

            console.log(`[點擊] ${target} ${logInfo ? `| ${logInfo}` : ''}`);
            element.click();
            await sleep(100);
            return true;
        } catch (error) {
            console.error(`[錯誤] 點擊失敗: ${target}`, error);
            return false;
        }
    }

    /**
     * 下載投票結果為 JPG
     */
    function saveAsJPG() {
        const element = document.querySelector("body > div.c-main > form");
        if (!element) return;

        const children = Array.from(element.children).slice(0, 4);
        const tempDiv = document.createElement("div");
        tempDiv.style.background = "white";
        children.forEach(el => tempDiv.appendChild(el.cloneNode(true)));

        // 暫時加入 body 以利渲染
        document.body.appendChild(tempDiv);
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';

        // 取得股票代號
        const stockNumber = getStockNumber() ?? "投票結果";

        html2canvas(tempDiv, { scale: 2, useCORS: true }).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/jpeg", 1.0);
            link.download = `${idNo}_${stockNumber}.jpg`;
            link.click();
            document.body.removeChild(tempDiv);
        });

        // 保存股票代號紀錄
        saveStockNumber();
    }

    /**
     * 保存已下載截圖的股票代號
     */
    function saveStockNumber() {
        const stockNumber = getStockNumber();

        if (!idNo || !stockNumber) {
            console.warn(`[saveStockNumber] 無法保存：idNo=${idNo}, stockNumber=${stockNumber}`);
            return;
        }

        // 初始化帳號記錄
        if (!savedStocks[idNo]) {
            savedStocks[idNo] = [];
        }

        // 未儲存才加入
        if (!savedStocks[idNo].includes(stockNumber)) {
            savedStocks[idNo].push(stockNumber);
            GM_setValue(SAVED_KEY, savedStocks);
            console.log(`[saveStockNumber] 已儲存 ${stockNumber} 至帳號 ${idNo}`);
        } else {
            console.log(`[saveStockNumber] ${stockNumber} 已存在於帳號 ${idNo}`);
        }
    }

    /**
     * 從首頁 HTML 取得戶號
     * @returns {Promise<string|null>}
     */
    async function fetchAndParseIdNO() {
        try {
            console.log('[fetchAndParseIdNO] 開始抓取 IdNO...');
            const response = await fetch('/evote/shareholder/000/tc_estock_welshas.html', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn(`[fetchAndParseIdNO] 請求失敗，HTTP ${response.status}`);
                return null;
            }

            const html = await response.text();
            return getIdNO(html);

        } catch (error) {
            console.error('[fetchAndParseIdNO] 發生錯誤：', error);
            return null;
        }
    }

    /**
     * 從 HTML 解析戶號
     * @param {string} html
     * @returns {string|null}
     */
    function getIdNO(html) {
        const regex = /idNo\s*:\s*'([A-Z]\d{9})'/i;
        const match = html.match(regex);

        if (match && match[1]) {
            console.log(`[getIdNO] 從 HTML 解析 IdNO: ${match[1]}`);
            return match[1];
        } else {
            console.log('[getIdNO] 無法解析 IdNO');
            return null;
        }
    }

    /**
     * 等待 idNo 變數有值
     * @param {number} maxRetries - 最大重試次數
     * @param {number} delay - 每次間隔毫秒
     * @returns {Promise<string|null>}
     */
    async function waitUntilIdNOAvailable(maxRetries = 10, delay = 500) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (idNo) {
                console.log(`[waitUntilIdNOAvailable] idNo 已取得：${idNo}（第 ${attempt} 次）`);
                return idNo;
            }

            console.log(`[waitUntilIdNOAvailable] 第 ${attempt} 次等待 idNo...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.warn(`[waitUntilIdNOAvailable] 超過最大次數，idNo 仍為 null`);
        return null;
    }

    /**
     * 取得股票代號
     * @returns {string|null}
     */
    function getStockNumber() {
        const text = document.querySelector("body > div.c-main > form > div.c-votelist_title > h2")?.innerText.trim();
        const match = text?.match(/貴股東對(\S+)/);
        return match ? match[1] : null;
    }

    /**
     * 標註已儲存的股票代號
     * @param {string[]} savedStockList
     */
    function markSavedStockRows(savedStockList = []) {
        try {
            console.log(`[markSavedStockRows] 標記帳號 ${idNo} 的已保存股票：${savedStockList.join(', ')} ( 共 ${savedStockList.length} 個 )`);

            const stockRows = document.querySelectorAll('#stockInfo tbody tr');

            stockRows.forEach(row => {
                const stockCodeCell = row.querySelector('div.u-width--40');
                const appendTargetCell = row.querySelector('td.u-width--20');
                if (!stockCodeCell || !appendTargetCell) return;

                const stockCode = stockCodeCell.textContent.trim();

                if (savedStockList.includes(stockCode)) {
                    const alreadyTagged = stockCodeCell.innerHTML.includes('已保存');
                    if (!alreadyTagged) {
                        const savedTag = document.createElement('span');
                        savedTag.textContent = '（已保存）';
                        savedTag.className = 'savedTag';
                        savedTag.style.color = 'green';
                        savedTag.style.marginLeft = '5px';
                        savedTag.style.fontSize = '7px';
                        appendTargetCell.appendChild(savedTag);
                    }
                }
            });
        } catch (error) {
            console.error('標記已保存股票時發生錯誤：', error);
        }
    }

    /**
     * 自動進入第一個尚未保存的股票查詢
     */
    async function enterFirstUnmarkedStock() {
        try {
            const stockRows = document.querySelectorAll('#stockInfo tbody tr');

            for (const row of stockRows) {
                const stockCodeCell = row.querySelector('div.u-width--40');
                const appendTargetCell = row.querySelector('td.u-width--20');
                if (!stockCodeCell || !appendTargetCell) continue;
                const stockCode = stockCodeCell.textContent.trim();
                const savedTag = appendTargetCell.querySelector('.savedTag');
                if (savedTag) {
                    console.log(`[enterFirstUnmarkedStock] 股票 ${stockCode} 已保存，跳過`);
                    continue;
                }
                const enterLink = row.querySelector('td.u-width--20 a:nth-child(2)');
                if (enterLink) {
                    console.log(`[enterFirstUnmarkedStock] 進入股票 ${stockCode}`);
                    await clickAndWait(enterLink, '查詢', `查詢 ${stockCode} 的投票結果`);
                    return;
                }
            }
            console.warn('[enterFirstUnmarkedStock] 找不到尚未保存的股票');
        } catch (error) {
            console.error('[enterFirstUnmarkedStock] 發生錯誤：', error);
        }
    }

    /**
     * 創建懸浮操作面板
     */
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.id = 'tdcc-float-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '24px';
        panel.style.right = '24px';
        panel.style.zIndex = '9999';
        panel.style.background = 'rgba(255,255,255,0.98)';
        panel.style.border = 'none';
        panel.style.borderRadius = '14px';
        panel.style.padding = '10px 14px 8px 14px';
        panel.style.boxShadow = '0 4px 24px 0 rgba(30, 136, 229, 0.13), 0 1.5px 6px 0 rgba(0,0,0,0.08)';
        panel.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        panel.style.fontSize = '13px';
        panel.style.minWidth = '140px';
        panel.style.maxWidth = '180px';
        panel.style.color = '#222';
        panel.style.userSelect = 'none';
        panel.style.transition = 'box-shadow 0.18s, background 0.18s';
        panel.style.backdropFilter = 'blur(2px)';
        panel.onmouseenter = () => panel.style.boxShadow = '0 8px 32px 0 rgba(30,136,229,0.18)';
        panel.onmouseleave = () => panel.style.boxShadow = '0 4px 24px 0 rgba(30,136,229,0.13), 0 1.5px 6px 0 rgba(0,0,0,0.08)';

        // 標題列
        const title = document.createElement('div');
        title.textContent = 'Tdcc 投票小幫手';
        title.style.fontWeight = '600';
        title.style.fontSize = '14px';
        title.style.letterSpacing = '0.5px';
        title.style.marginBottom = '4px';
        title.style.color = '#1976d2';
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '4px';
        title.style.lineHeight = '1.2';
        title.style.padding = '0 0 2px 0';
        panel.appendChild(title);

        // idNo 顯示
        const idNoDiv = document.createElement('div');
        idNoDiv.textContent = (idNo ? 'idNo：' + idNo : 'idNo：-');
        idNoDiv.style.marginBottom = '6px';
        idNoDiv.style.fontSize = '11px';
        idNoDiv.style.color = '#888';
        idNoDiv.style.fontWeight = '400';
        idNoDiv.style.letterSpacing = '0.2px';
        idNoDiv.style.lineHeight = '1.2';
        panel.appendChild(idNoDiv);

        // 清除按鈕
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清除標記';
        clearBtn.style.padding = '4px 10px';
        clearBtn.style.background = 'linear-gradient(90deg,#1976d2 60%,#64b5f6 100%)';
        clearBtn.style.color = 'white';
        clearBtn.style.border = 'none';
        clearBtn.style.borderRadius = '6px';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.fontWeight = '500';
        clearBtn.style.fontSize = '12px';
        clearBtn.style.boxShadow = '0 1px 4px 0 rgba(25,118,210,0.10)';
        clearBtn.style.marginBottom = '2px';
        clearBtn.style.marginTop = '2px';
        clearBtn.style.transition = 'background 0.18s, filter 0.18s';
        clearBtn.onmouseenter = () => clearBtn.style.filter = 'brightness(1.10)';
        clearBtn.onmouseleave = () => clearBtn.style.filter = '';
        clearBtn.onclick = () => {
            if (confirm('確定要清除所有已保存的股票記錄嗎？')) {
                GM_setValue(SAVED_KEY, {});
                window.location.reload();
            }
        };
        panel.appendChild(clearBtn);

        // 拖曳功能
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        title.style.cursor = 'grab';
        function clampPanelPosition() {
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const panelW = panel.offsetWidth;
            const panelH = panel.offsetHeight;
            let left = parseInt(panel.style.left, 10);
            let top = parseInt(panel.style.top, 10);
            if (isNaN(left)) left = winW - panelW - 24;
            if (isNaN(top)) top = winH - panelH - 24;
            left = Math.max(0, Math.min(left, winW - panelW));
            top = Math.max(0, Math.min(top, winH - panelH));
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
        function onMouseMove(e) {
            if (!isDragging) return;
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const panelW = panel.offsetWidth;
            const panelH = panel.offsetHeight;
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            newLeft = Math.max(0, Math.min(newLeft, winW - panelW));
            newTop = Math.max(0, Math.min(newTop, winH - panelH));
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
        function onMouseUp() {
            isDragging = false;
            panel.style.cursor = 'default';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        title.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        window.addEventListener('resize', clampPanelPosition);
        setTimeout(clampPanelPosition, 0);

        document.body.appendChild(panel);
    }

    /**
     * 等待 token 變數準備好
     * 會檢查 voteObj 是否有 getSignature 方法，若有則輪詢 token 是否有值，直到超時
     * @param {number} timeout - 超時毫秒數，預設 5000
     * @returns {Promise<boolean>} - token 有值 resolve(true)，否則 reject
     */
    function waitForTokenReady(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const hasGetSignature = voteObj?.hasOwnProperty('getSignature') && typeof voteObj.getSignature === 'function';

            if (!hasGetSignature) {
                // 無 getSignature 直接結束
                return resolve(false);
            }

            const start = Date.now();

            const timer = setInterval(() => {
                // 每次重新讀取 token
                const token = document?.voteform?.token?.value;

                if (token && token.trim().length > 0) {
                    clearInterval(timer);
                    resolve(true);
                }

                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error('等待 token 超時'));
                }
            }, 100);
        });
    }

    /**
     * 主程式入口
     */
    async function main() {
        const currentPath = window.location.pathname;
        console.log(`[當前網址] ${currentPath}`);

        if (currentPath.includes('/evote/shareholder/001/6_01.html')) {
            console.log('進行電子投票 - 最後的確認');
            await clickAndWait('#go', '確認', '確認');
        } else if (currentPath.includes('/evote/shareholder/001/')) {
            console.log('進行電子投票 - 投票中');

            // 等待 token 準備好
            await waitForTokenReady();

            // 全部棄權
            await clickAndWait('body > div.c-main > form > table:nth-child(3) > tbody > tr.u-t_align--right > td:nth-child(2) > a:nth-child(3)', '全部棄權', '勾選全部棄權(1)');
            await clickAndWait('body > div.c-main > form > div.c-votelist_actions > button:nth-child(2)', '下一步', '按下 下一步(1)');

            // 全部棄權 2
            await clickAndWait('#voteform > table:nth-child(5) > tbody > tr > td.u-t_align--right > a:nth-child(8)', '全部棄權', '勾選全部棄權(2)');
            await clickAndWait('#voteform > div.c-votelist_actions > button:nth-child(1)', '下一步', '按下 下一步(2)');
            await clickAndWait('body > div.jquery-modal.blocker.current > div > div:nth-child(2) > button:nth-child(1)', '下一步', '按下 下一步(2.2)');

            // 全部棄權 3
            await clickAndWait('body > div.jquery-modal.blocker.current > div > div > button:nth-child(1)', '下一步', '按下 下一步(3.2)');

            // 確認投票結果
            console.log('進行電子投票 - 投票確認');
            await sleep(500);
            await clickAndWait('body > div.c-main > form > div.c-votelist_actions > button:nth-child(1)', '確認投票結果', '確認投票結果');
        } else if (currentPath === '/evote/shareholder/000/tc_estock_welshas.html') {
            console.log('位於投票列表首頁');

            // 創建懸浮面板
            await waitUntilIdNOAvailable();
            createFloatingPanel();

            // 標註已儲存的股票
            markSavedStockRows(savedStocks[idNo] ?? []);

            // 自動進入尚未投票的股票
            const enterLink = await clickAndWait('//*[@id="stockInfo"]/tbody/tr[1]/td[4]/a[1]', '投票', '進入投票');

            if (!enterLink) {
                // 自動進入尚未保存結果的股票
                await enterFirstUnmarkedStock();
            }

        } else if (currentPath === '/evote/shareholder/002/01.html') {
            console.log('準備列印投票結果');

            await waitUntilIdNOAvailable();
            if (document.querySelector("#printPage")?.innerText.trim() === '列印') {
                // 保存並返回
                saveAsJPG();
                await sleep(200);
                await clickAndWait('body > div.c-main > form > div.c-votelist_actions > button:nth-child(2)', '返回', '返回');
            }
        } else {
            console.warn('當前網址不在預期範圍內');
        }

        console.log('✅ 完成');
    }

    // 頁面載入後執行主程式
    window.addEventListener("load", () => setTimeout(main, 500));
})();
