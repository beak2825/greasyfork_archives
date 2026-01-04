// ==UserScript==
// @name         Bilibili 换一换历史记录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为Bilibili主页上的 换一换 添加回滚功能，可配置历史记录限制
// @author       MaoShiSanKe
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502578/Bilibili%20%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502578/Bilibili%20%E6%8D%A2%E4%B8%80%E6%8D%A2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const feedHistory = [];
    let feedHistoryIndex = 0;
    let historyLimit = GM_getValue('historyLimit', 3); // Load saved limit or default to 3
    let autoDelete = GM_getValue('autoDelete', true); // Load saved setting or default to true

    let historyLimitCommandId;
    let autoDeleteCommandId;

    // Register menu commands for user settings
    function updateMenuCommands() {
        if (historyLimitCommandId) {
            GM_unregisterMenuCommand(historyLimitCommandId);
        }
        if (autoDeleteCommandId) {
            GM_unregisterMenuCommand(autoDeleteCommandId);
        }
        autoDeleteCommandId = GM_registerMenuCommand(`${autoDelete ? '✅自动删除已开启' : '❌自动删除已关闭'}`, toggleAutoDelete);
        historyLimitCommandId = GM_registerMenuCommand(`设置历史限制 (当前: ${historyLimit === 0 ? '无限制' : historyLimit})`, setHistoryLimit);
        addTooltipToHistoryLimit();
    }

    updateMenuCommands();

    const feedRollBackBtn = `
    <button id="feed-roll-back-btn" class="primary-btn roll-btn" style="margin-top: 10px;">
        <span>回</span>
    </button>
    `;

    const feedRollNextBtn = `
    <button id="feed-roll-next-btn" class="primary-btn roll-btn" style="margin-top: 10px;">
        <span>行</span>
    </button>
    `;

    const clearHistoryBtn = `
    <button id="clear-history-btn" class="primary-btn roll-btn" style="margin-top: 10px;">
        <span>清</span>
    </button>
    `;

    const targetNode = document.querySelector('.recommended-container_floor-aside');
    const observer = new MutationObserver(() => {
        let feedRollBtn = document.querySelector('.roll-btn');

        if (feedRollBtn && !document.getElementById('feed-roll-back-btn')) {
            // 创建返回按钮
            let backBtn = document.createElement('button');
            feedRollBtn.parentNode.appendChild(backBtn);
            backBtn.outerHTML = feedRollBackBtn;

            document.getElementById('feed-roll-back-btn').addEventListener('click', () => {
                let feedCards = document.getElementsByClassName('feed-card');
                if (feedHistoryIndex == feedHistory.length) {
                    feedHistory.push(listInnerHTMLOfFeedCard(feedCards));
                }
                for (let fc_i = 0; fc_i < feedCards.length; fc_i++) {
                    feedCards[fc_i].innerHTML = feedHistory[feedHistoryIndex - 1][fc_i];
                }
                feedHistoryIndex = feedHistoryIndex - 1;
                if (feedHistoryIndex == 0) {
                    disableElementById('feed-roll-back-btn', true);
                }
                disableElementById('feed-roll-next-btn', false);
            });
        }

        if (feedRollBtn && !document.getElementById('feed-roll-next-btn')) {
            // 创建下一页按钮
            let nextBtn = document.createElement('div');
            feedRollBtn.parentNode.appendChild(nextBtn);
            nextBtn.outerHTML = feedRollNextBtn;

            document.getElementById('feed-roll-next-btn').addEventListener('click', () => {
                let feedCards = document.getElementsByClassName('feed-card');
                for (let fc_i = 0; fc_i < feedCards.length; fc_i++) {
                    feedCards[fc_i].innerHTML = feedHistory[feedHistoryIndex + 1][fc_i];
                }
                feedHistoryIndex = feedHistoryIndex + 1;
                if (feedHistoryIndex == feedHistory.length - 1) {
                    disableElementById('feed-roll-next-btn', true);
                }
                disableElementById('feed-roll-back-btn', false);
            });
        }

        if (feedRollBtn && !document.getElementById('clear-history-btn')) {
            // 创建清除历史按钮
            let clearBtn = document.createElement('div');
            feedRollBtn.parentNode.appendChild(clearBtn);
            clearBtn.outerHTML = clearHistoryBtn;

            document.getElementById('clear-history-btn').addEventListener('contextmenu', (event) => {
                event.preventDefault();
                feedHistory.length = 0;
                feedHistoryIndex = 0;
                disableElementById('feed-roll-back-btn', true);
                disableElementById('feed-roll-next-btn', true);
                alert('历史记录已清除');
            });
        }

        // 处理点击换一换事件
        if (feedRollBtn) {
            feedRollBtn.id = 'feed-roll-btn';
            feedRollBtn.addEventListener('click', () => {
                setTimeout(() => {
                    if (feedHistoryIndex == feedHistory.length) {
                        let feedCards = listInnerHTMLOfFeedCard(document.getElementsByClassName('feed-card'));
                        feedHistory.push(feedCards);
                        if (autoDelete && feedHistory.length > historyLimit) {
                            feedHistory.shift();
                            feedHistoryIndex--;
                        }
                    }
                    feedHistoryIndex = feedHistory.length;
                    disableElementById('feed-roll-back-btn', false);
                    disableElementById('feed-roll-next-btn', true);
                });
            });

            // 停止观察
            observer.disconnect();
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });

    function disableElementById(id, bool) {
        if (bool) {
            document.getElementById(id).classList.add('biliplus-disabled');
        } else {
            document.getElementById(id).classList.remove('biliplus-disabled');
        }
    }

    function listInnerHTMLOfFeedCard(feedCardElements) {
        let feedCardInnerHTMLs = [];
        for (let fc of feedCardElements) {
            feedCardInnerHTMLs.push(fc.innerHTML);
        }
        return feedCardInnerHTMLs;
    }

    function setHistoryLimit() {
        const limit = prompt('设置历史记录限制 (0 表示无限制)\n非0时需开启自动删除', historyLimit);
        if (limit !== null) {
            historyLimit = parseInt(limit, 10);
            if (isNaN(historyLimit) || historyLimit < 0) {
                historyLimit = 3; // Reset to default if invalid input
                alert('无效输入。历史记录限制重置为默认值 (3)。');
            } else {
                alert(`历史记录限制设置为 ${historyLimit === 0 ? '无限制' : historyLimit}。`);
                if (historyLimit === 0) {
                    autoDelete = false;
                }
            }
            GM_setValue('historyLimit', historyLimit); // Save the new limit
            updateMenuCommands(); // Update menu commands to reflect new value
        }
    }

    function toggleAutoDelete() {
        autoDelete = !autoDelete;
        if (autoDelete && historyLimit === 0) {
            historyLimit = 3; // Set to default if auto-delete is enabled and limit is 0
        }
        alert(`${autoDelete ? '✅自动删除已开启' : '❌自动删除已关闭'}`);
        GM_setValue('autoDelete', autoDelete); // Save the new setting
        updateMenuCommands(); // Update menu commands to reflect new value
    }

    function addTooltipToHistoryLimit() {
        const historyLimitElement = document.querySelector(`[title="设置历史限制 (当前: ${historyLimit === 0 ? '无限制' : historyLimit})"]`);
        if (historyLimitElement) {
            historyLimitElement.title = `此选项需开启自动删除，当前${autoDelete ? '✅自动删除已开启' : '❌自动删除已关闭'}`;
        }
    }
})();
