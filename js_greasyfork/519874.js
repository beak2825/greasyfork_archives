// ==UserScript==
// @name         剪贴板历史记录助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在页面右侧显示剪贴板历史记录
// @author       Your name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519874/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519874/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.hasRunClipboardHelper) return;
    window.hasRunClipboardHelper = true;

    GM_addStyle(`
        #clipboard-panel {
            position: fixed !important;
            right: 0 !important;
            top: 20% !important;
            width: 250px !important;
            max-height: 60vh !important;
            background: #fff !important;
            border: 1px solid #ccc !important;
            border-radius: 4px 0 0 4px !important;
            padding: 10px !important;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.1) !important;
            z-index: 2147483647 !important;
            overflow-y: auto !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            box-sizing: border-box !important;
            transition: all 0.3s ease !important;
        }

        #clipboard-panel.hidden {
            transform: translateX(235px) !important;
        }

        #clipboard-panel.hidden:hover {
            transform: translateX(230px) !important;
        }

        #clipboard-panel::before {
            content: "📋" !important;
            position: absolute !important;
            left: 10px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            font-size: 20px !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            cursor: pointer !important;
        }

        #clipboard-panel.hidden::before {
            opacity: 1 !important;
        }

        #clipboard-panel.hidden .clipboard-controls,
        #clipboard-panel.hidden #clipboard-list {
            visibility: hidden !important;
        }

        .clipboard-controls {
            display: flex !important;
            justify-content: flex-end !important;
            gap: 8px !important;
            margin-bottom: 10px !important;
            transition: opacity 0.3s ease !important;
        }

        .clipboard-btn {
            padding: 4px 8px !important;
            border: 1px solid #ddd !important;
            border-radius: 3px !important;
            background: #f5f5f5 !important;
            cursor: pointer !important;
            font-size: 12px !important;
        }

        .clipboard-item {
            padding: 8px !important;
            border: 1px solid #eee !important;
            margin-bottom: 5px !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            background: #fff !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }

        .clipboard-item:hover {
            background: #f5f5f5 !important;
            white-space: normal !important;
            word-break: break-all !important;
        }

        .clipboard-item.pinned {
            border-left: 3px solid #4CAF50 !important;
            background: #f8fff8 !important;
        }
    `);

    // 创建面板
    const panel = document.createElement('div');
    panel.id = 'clipboard-panel';
    panel.innerHTML = `
        <div class="clipboard-controls">
            <button class="clipboard-btn" id="clear-history">清空</button>
            <button class="clipboard-btn" id="hide-panel"></button>
        </div>
        <div id="clipboard-list"></div>
    `;
    document.body.appendChild(panel);

    // 初始化数据
    let clipboardHistory = GM_getValue('clipboardHistory', []);
    let pinnedItems = GM_getValue('pinnedItems', []);
    const maxHistoryItems = 10;

    // 更新面板显示
    function updatePanel() {
        const listElement = document.getElementById('clipboard-list');
        const allItems = [
            ...pinnedItems.map(text => ({ text, pinned: true })),
            ...clipboardHistory
                .filter(text => !pinnedItems.includes(text))
                .map(text => ({ text, pinned: false }))
        ];

        listElement.innerHTML = allItems
            .map((item, index) => `
                <div class="clipboard-item ${item.pinned ? 'pinned' : ''}"
                     data-index="${index}"
                     title="${item.text}">
                    ${item.pinned ? '📌 ' : ''}${item.text}
                </div>
            `)
            .join('');

        // 根据是否有记录来设置点击外部自动隐藏
        if (allItems.length === 0) {
            // 无记录时添加点击外部自动隐藏
            if (!window.clipboardAutoHideHandler) {
                window.clipboardAutoHideHandler = (e) => {
                    if (!panel.contains(e.target) && !panel.classList.contains('hidden')) {
                        panel.classList.add('hidden');
                    }
                };
                document.addEventListener('click', window.clipboardAutoHideHandler);
            }
        } else {
            // 有记录时移除点击外部自动隐藏
            if (window.clipboardAutoHideHandler) {
                document.removeEventListener('click', window.clipboardAutoHideHandler);
                window.clipboardAutoHideHandler = null;
            }
        }

        // 添加事件监听
        document.querySelectorAll('.clipboard-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = allItems[item.dataset.index].text;
                GM_setClipboard(text, 'text');
                item.style.backgroundColor = '#e6ffe6';
                setTimeout(() => {
                    item.style.backgroundColor = '';
                }, 500);
            });

            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const text = allItems[item.dataset.index].text;
                const isPinned = pinnedItems.includes(text);
                if (isPinned) {
                    pinnedItems = pinnedItems.filter(t => t !== text);
                } else {
                    pinnedItems.unshift(text);
                }
                GM_setValue('pinnedItems', pinnedItems);
                updatePanel();
            });
        });
    }

    // 事件监听
    document.getElementById('hide-panel').addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    panel.addEventListener('click', (e) => {
        if (panel.classList.contains('hidden')) {
            e.stopPropagation();
            panel.classList.remove('hidden');
        }
    });

    document.getElementById('clear-history').addEventListener('click', () => {
        clipboardHistory = [];
        pinnedItems = [];
        GM_setValue('clipboardHistory', clipboardHistory);
        GM_setValue('pinnedItems', pinnedItems);
        updatePanel();
    });

    // 监听复制事件
    document.addEventListener('copy', () => {
        setTimeout(() => {
            const selection = window.getSelection().toString().trim();
            if (selection && !clipboardHistory.includes(selection)) {
                clipboardHistory.unshift(selection);
                if (clipboardHistory.length > maxHistoryItems) {
                    clipboardHistory.pop();
                }
                GM_setValue('clipboardHistory', clipboardHistory);
                updatePanel();
            }
        }, 100);
    });

    // 初始化显示
    updatePanel();
})();