// ==UserScript==
// @name         种子认领助手-PTLGS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键认领或取消当前做种的种子
// @author       origin1699
// @match        *://ptlgs.org/userdetails.php* 
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541984/%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E5%8A%A9%E6%89%8B-PTLGS.user.js
// @updateURL https://update.greasyfork.org/scripts/541984/%E7%A7%8D%E5%AD%90%E8%AE%A4%E9%A2%86%E5%8A%A9%E6%89%8B-PTLGS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 配置参数 =====
    const CONFIG = {
        minWaitTime: 1000,
        maxWaitTime: 2000,
        interPageWaitTime: 3000,
        testMode: false
    };

    const ACTION_STATUS = Object.freeze({
        claim: '认领',
        cancel: '取消',
        clear: '清理'
    });

    const ACTION_CONFIG = {
        claim: {
            act: 'add',
            logText: '认领种子',
            condition: (status) => status.includes('addClaim')
        },
        cancel: {
            act: 'del',
            logText: '取消认领种子',
            condition: (status) => status.includes('removeClaim')
        }
    };

    const SELECTORS = {
        mainTable: 'table[border="1"]',
        toggleLink: 'a[href*="getusertorrentlistajax"][href*="seeding"]',
        torrentLink: "a[href*='details.php']",
        actionButton: 'button[style*="display: flex"]',
        seedCount: 'div > div > b'
    };

    // ===== 样式注入 =====
    GM_addStyle(`
        .seed-action-btn {
            margin: 5px;
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        .seed-action-btn:hover { background-color: #45a049; }
        .seed-action-btn.cancel { background-color: #f44336; }
        .seed-action-btn.cancel:hover { background-color: #d32f2f; }
        .seed-action-btn.test-mode { background-color: #2196F3; }
        .seed-action-btn.test-mode:hover { background-color: #0b7dda; }
        .seed-action-btn.clean { background-color: #9e9e9e; }
        .seed-action-btn.clean:hover { background-color: #757575; }
        .seed-action-btn:disabled {
            background-color: #cccccc !important;
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        /* 自定义弹窗样式 */
        .ptlgs-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 99999;
            min-width: 300px;
            text-align: center;
            border-top: 4px solid #4CAF50;
            font-family: Arial, sans-serif;
        }
        .ptlgs-alert.cancel { border-top-color: #f44336; }
        .ptlgs-alert.clean { border-top-color: #9e9e9e; }
        .ptlgs-alert h3 {
            margin-top: 0;
            color: #333;
            font-size: 1.2em;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .ptlgs-alert p {
            margin: 10px 0;
            line-height: 1.5;
        }
        .ptlgs-alert .stats {
            font-weight: bold;
            margin: 15px 0;
            font-size: 1.1em;
        }
        .ptlgs-alert .success { color: #4CAF50; }
        .ptlgs-alert .fail { color: #f44336; }
        .ptlgs-alert .limit { color: #FF9800; }
        .ptlgs-alert .btn-ok {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
            margin-top: 15px;
            transition: background 0.3s;
        }
        .ptlgs-alert .btn-ok:hover {
            background: #45a049;
        }
        .ptlgs-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
        }
        
        /* 缓存信息样式 */
        .cache-info {
            margin-top: 10px;
            padding: 8px;
            background: #f9f9f9;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .cache-count {
            font-weight: bold;
            color: #2196F3;
        }
    `);

    // ===== 工具函数 =====
    function log(message) {
        console.log(`[种子认领助手] ${message}`);
    }

    function randomWait(min = CONFIG.minWaitTime, max = CONFIG.maxWaitTime) {
        const waitTime = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    function createActionButton(text, className, clickHandler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = `seed-action-btn ${className}`;
        btn.addEventListener('click', clickHandler);
        return btn;
    }

    // 获取缓存数据
    function getCachedData() {
        return new Set(GM_getValue('claimedData', []));
    }

    // 更新缓存数据
    function updateCachedData(data) {
        GM_setValue('claimedData', Array.from(data));
    }

    // 创建自定义弹窗
    function showAlert(title, message, stats, actionType = 'claim') {
        return new Promise(resolve => {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'ptlgs-overlay';

            // 创建弹窗
            const alertBox = document.createElement('div');
            alertBox.className = `ptlgs-alert ${actionType}`;

            // 弹窗标题
            const titleEl = document.createElement('h3');
            titleEl.textContent = title;
            alertBox.appendChild(titleEl);

            // 弹窗消息
            const messageEl = document.createElement('p');
            messageEl.textContent = message;
            alertBox.appendChild(messageEl);

            // 统计信息
            if (stats) {
                const statsEl = document.createElement('div');
                statsEl.className = 'stats';

                if (stats.successCount !== undefined) {
                    const successEl = document.createElement('p');
                    successEl.className = 'success';
                    successEl.innerHTML = `✅ 成功${ACTION_STATUS[actionType]}: <b>${stats.successCount}</b> 个`;
                    statsEl.appendChild(successEl);
                }

                if (stats.failCount !== undefined) {
                    const failEl = document.createElement('p');
                    failEl.className = 'fail';
                    failEl.innerHTML = `❌ 失败: <b>${stats.failCount}</b> 个`;
                    statsEl.appendChild(failEl);
                }

                if (stats.claimedCount !== undefined) {
                    const limitEl = document.createElement('p');
                    limitEl.className = 'limit';
                    limitEl.innerHTML = `⚠️ 认领达到人数上限: <b>${stats.claimedCount}</b> 个`;
                    statsEl.appendChild(limitEl);
                }

                if (stats.cacheCleared !== undefined) {
                    const cacheEl = document.createElement('p');
                    cacheEl.className = 'success';
                    cacheEl.innerHTML = `🗑️ 已清理缓存数据: <b>${stats.cacheCleared}</b> 条`;
                    statsEl.appendChild(cacheEl);
                }

                alertBox.appendChild(statsEl);
            }

            // 添加缓存信息（非清理操作时显示）
            if (actionType !== 'clear') {
                const cacheInfo = document.createElement('div');
                cacheInfo.className = 'cache-info';
                const cacheSize = getCachedData().size;
                cacheInfo.innerHTML = `当前缓存: <span class="cache-count">${cacheSize}</span> 个达到认领上限的种子`;
                alertBox.appendChild(cacheInfo);
            }

            // 确定按钮
            const okButton = document.createElement('button');
            okButton.className = 'btn-ok';
            okButton.textContent = '确定';
            okButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
                document.body.removeChild(alertBox);
                resolve();
            });
            alertBox.appendChild(okButton);

            // 添加到文档
            document.body.appendChild(overlay);
            document.body.appendChild(alertBox);
        });
    }

    // ===== 核心操作 =====
    function getTorrentsFromRows(rows, action) {
        const {condition} = ACTION_CONFIG[action];
        const isClaimAction = action === 'claim';
        return Array.from(rows)
            .slice(1) // 跳过表头
            .map(row => {
                const button = row.querySelector(SELECTORS.actionButton);
                if (!button) return null;

                const buttonAction = button.dataset.action || '';
                if (!condition(buttonAction)) return null;

                const titleElement = row.querySelector(SELECTORS.torrentLink);
                return {
                    id: isClaimAction? button.dataset.torrent_id : button.dataset.claim_id,
                    title: titleElement.title,
                    action: buttonAction
                };
            })
            .filter(Boolean);
    }

    async function processSingleTorrent(torrent, action, claimed) {
        const {logText} = ACTION_CONFIG[action];
        const isClaimAction = action === 'claim';
        let isNeedWait = true;
        try {
            // 检查缓存限制
            if (isClaimAction && claimed.has(torrent.id)) {
                isNeedWait = false;
                log(`${logText}: ${torrent.title} - 失败, 认领达到人数上限(缓存数据)`);
                return {success: false, claimed: true};
            }

            // 测试模式处理
            if (CONFIG.testMode) {
                log(`[测试模式] 模拟${logText}: ${torrent.title}`);
                return {success: true};
            }

            // 实际API请求
            const params = isClaimAction ? `action=${torrent.action}&params[torrent_id]=${torrent.id}`
                : `action=${torrent.action}&params[id]=${torrent.id}`;

            const response = await fetch(`${window.location.origin}/ajax.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: encodeURI(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态码: ${response.status}`);
            }

            const data = await response.json();
            const {msg, ret} = data;

            // 处理API响应
            if (ret === -1 && msg === '认领达到人数上限') {
                if (isClaimAction) claimed.add(torrent.id);
                log(`${logText}: ${torrent.title} - 失败, 认领达到人数上限`);
                return {success: false, claimed: isClaimAction};
            }

            if (ret === 0 && msg === 'OK') {
                log(`${logText}: ${torrent.title} - 成功`);
                return {success: true};
            }

            log(`${logText}: ${torrent.title} - 失败, msg: ${msg}`);
            return {success: false};

        } catch (error) {
            log(`处理种子 ${torrent.title} 时出错: ${error.message}`);
            return {success: false};
        } finally {
            if (isNeedWait) {
                await randomWait();
            }
        }
    }

    async function executeActions(torrents, action) {
        const {logText} = ACTION_CONFIG[action];
        const isClaimAction = action === 'claim';

        let claimed = isClaimAction ? getCachedData() : new Set();
        let successCount = 0, failCount = 0, claimedCount = 0;

        for (const torrent of torrents) {
            const result = await processSingleTorrent(torrent, action, claimed);

            if (result.success) {
                successCount++;
            } else {
                failCount++;
                if (result.claimed) claimedCount++;
            }
        }

        if (isClaimAction) {
            updateCachedData(claimed);
        }

        return {successCount, failCount, claimedCount};
    }

    async function processTorrentList(torrents, action) {
        if (torrents.length === 0) {
            await showAlert(
                '操作提示',
                `当前页面没有可${ACTION_STATUS[action]}的种子。`,
                null,
                action
            );
            return {successCount: 0, failCount: 0, claimedCount: 0};
        }

        log(`找到 ${torrents.length} 个可${ACTION_STATUS[action]}的种子`);
        return await executeActions(torrents, action);
    }

    // ===== 页面处理 =====
    async function processCurrentPage(action) {
        log(`开始处理当前页面...`);
        const rows = document.querySelectorAll(`${SELECTORS.mainTable} tr`);
        const torrents = getTorrentsFromRows(rows, action);
        const stats = await processTorrentList(torrents, action);

        await showAlert(
            '本页操作完成',
            `已处理完当前页面的所有种子。`,
            stats,
            action
        );
    }

    function getAllPageLinks() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        if (!userId) return [];

        const countElement = document.querySelector(SELECTORS.seedCount);
        if (!countElement) return [];

        const seedCount = parseInt(countElement.textContent, 10);
        log(`获取做种总数: ${seedCount}`);

        const totalPages = Math.ceil(seedCount / 100);
        return Array.from({length: totalPages}, (_, i) =>
            `getusertorrentlistajax.php?userid=${userId}&type=seeding&page=${i}`
        );
    }

    async function processAllPages(action) {
        log('开始处理所有页面...');
        const pageLinks = getAllPageLinks();

        if (pageLinks.length === 0) {
            log('未找到分页链接，仅处理当前页。');
            await processCurrentPage(action);
            return;
        }

        log(`共找到 ${pageLinks.length} 个页面进行处理。`);
        let totalSuccess = 0, totalFail = 0, totalClaimed = 0;

        for (const pageLink of pageLinks) {
            const pageUrl = new URL(pageLink, window.location.origin).href;
            log(`处理页面: ${pageUrl}`);

            try {
                const response = await fetch(pageUrl);
                if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const rows = doc.querySelectorAll(`${SELECTORS.mainTable} tr`);
                const torrents = getTorrentsFromRows(rows, action);

                if (torrents.length > 0) {
                    const {successCount, failCount, claimedCount} = await executeActions(torrents, action);
                    totalSuccess += successCount;
                    totalFail += failCount;
                    totalClaimed += claimedCount;
                }
            } catch (error) {
                log(`处理页面 ${pageUrl} 时出错: ${error.message}`);
            }

            if (!CONFIG.testMode) {
                await randomWait(CONFIG.interPageWaitTime, CONFIG.interPageWaitTime + 2000);
            }
        }

        await showAlert(
            '操作完成',
            `已处理完所有页面上的种子。`,
            {
                successCount: totalSuccess,
                failCount: totalFail,
                claimedCount: totalClaimed
            },
            action
        );
    }

    // ===== 缓存清理 =====
    async function clearCache() {
        const cachedData = getCachedData();
        const cacheSize = cachedData.size;

        if (cacheSize === 0) {
            await showAlert(
                '清理缓存',
                '当前没有需要清理的缓存数据。',
                {cacheCleared: 0},
                'clear'
            );
            return;
        }

        const confirm = await new Promise(resolve => {
            const handleConfirm = (result) => {
                document.body.removeChild(overlay);
                document.body.removeChild(confirmBox);
                resolve(result);
            };

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'ptlgs-overlay';

            // 创建确认弹窗
            const confirmBox = document.createElement('div');
            confirmBox.className = 'ptlgs-alert clean';
            confirmBox.innerHTML = `
                <h3>确认清理缓存</h3>
                <p>确定要清理 <b>${cacheSize}</b> 条认领缓存数据吗？</p>
                <p class="cache-info">清理后，系统将不再跳过这些种子的认领操作</p>
                <div style="margin-top: 20px;">
                    <button id="ptlgs-confirm-clear" class="btn-ok" style="background: #f44336; margin-right: 10px;">确认清理</button>
                    <button id="ptlgs-cancel-clear" class="btn-ok" style="background: #9e9e9e;">取消</button>
                </div>
            `;

            // 添加事件监听
            confirmBox.querySelector('#ptlgs-confirm-clear').addEventListener('click', () => handleConfirm(true));
            confirmBox.querySelector('#ptlgs-cancel-clear').addEventListener('click', () => handleConfirm(false));

            document.body.appendChild(overlay);
            document.body.appendChild(confirmBox);
        });

        if (!confirm) return;

        // 执行清理
        updateCachedData(new Set());
        log(`已清理 ${cacheSize} 条缓存数据`);

        await showAlert(
            '清理完成',
            '缓存数据已成功清理。',
            {cacheCleared: cacheSize},
            'clear'
        );
    }

    // ===== UI操作 =====
    function addButtonsToMainTable() {
        const toggleLink = document.querySelector(SELECTORS.toggleLink);
        if (!toggleLink) {
            log('未找到"显示/隐藏"链接');
            return;
        }

        const btnContainer = document.createElement('span');
        btnContainer.style.marginLeft = '10px';
        btnContainer.id = 'ptlgs-btn-container';

        // 添加操作按钮
        const actionButtons = [
            {text: '全部认领', action: 'claim', className: ''},
            {text: '全部取消认领', action: 'cancel', className: 'cancel'},
            {text: '清理缓存', action: 'clear', className: 'clean'}
        ];

        actionButtons.forEach(({text, action, className}) => {
            const btn = createActionButton(text, className, async () => {
                // 锁定所有按钮
                const buttons = document.querySelectorAll('#ptlgs-btn-container .seed-action-btn');
                buttons.forEach(btn => btn.disabled = true);

                // 更新当前按钮状态
                btn.textContent = action === 'clear' ? '清理中...' : '处理中...';
                btn.dataset.originalText = text;

                try {
                    switch (action) {
                        case 'claim':
                        case 'cancel':
                            if (confirm(`确定要${text}吗？这可能需要较长时间。`)) {
                                await processAllPages(action);
                            }
                            break;
                        case 'clear':
                            await clearCache();
                            break;
                    }
                } catch (error) {
                    log(`操作出错: ${error.message}`);
                    await showAlert('操作出错', `执行操作时发生错误: ${error.message}`, null, action);
                } finally {
                    // 恢复按钮状态
                    buttons.forEach(btn => {
                        btn.disabled = false;
                        if (btn.dataset.originalText) {
                            btn.textContent = btn.dataset.originalText;
                        }
                    });
                }
            });

            // 存储原始文本以便恢复
            btn.dataset.originalText = text;
            btnContainer.appendChild(btn);
        });
        /**
        // 添加测试模式切换按钮
        const testModeBtn = createActionButton(
            `测试模式: ${CONFIG.testMode ? '开' : '关'}`,
            'test-mode',
            () => {
                CONFIG.testMode = !CONFIG.testMode;
                testModeBtn.textContent = `测试模式: ${CONFIG.testMode ? '开' : '关'}`;
                log(`测试模式已${CONFIG.testMode ? '开启' : '关闭'}`);
            }
        );
        testModeBtn.dataset.originalText = `测试模式: ${CONFIG.testMode ? '开' : '关'}`;
        btnContainer.appendChild(testModeBtn);
        */
        toggleLink.parentNode.insertBefore(btnContainer, toggleLink.nextSibling);
        log('操作按钮已添加');
    }

    // ===== 初始化 =====
    function init() {
        try {
            addButtonsToMainTable();
            log('脚本初始化完成');
        } catch (error) {
            log(`初始化失败: ${error.message}`);
        }
    }

    window.addEventListener('load', init);
})();