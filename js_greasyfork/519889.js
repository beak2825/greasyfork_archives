// ==UserScript==
// @name         SubHD屏蔽机翻字幕
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  添加启用/禁用屏蔽机器翻译字幕的开关按钮，通过按钮样式区分状态
// @license      MIT
// @match        https://subhd.tv/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subhd.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519889/SubHD%E5%B1%8F%E8%94%BD%E6%9C%BA%E7%BF%BB%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/519889/SubHD%E5%B1%8F%E8%94%BD%E6%9C%BA%E7%BF%BB%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const blockKeyword = "机器翻译"; // 屏蔽关键字
    let isEnabled = true; // 默认启用屏蔽

    // 添加屏蔽按钮
    const addToggleButton = () => {
        const viewText = document.querySelector('.pt-2.view-text');
        if (!viewText) return;

        const subscribeBtn = viewText.querySelector('button.btn[role="button"]');
        if (!subscribeBtn) return;

        // 插入屏蔽按钮
        const btnHTML = `
            <button class="btn btn-info btn-sm f12 me-1 fav" id="toggleTranslateFilter" role="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
                    <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
                </svg>
                <span>屏蔽机翻</span>
            </button>
        `;
        subscribeBtn.insertAdjacentHTML('afterend', btnHTML);

        const toggleButton = document.getElementById('toggleTranslateFilter');
        toggleButton.addEventListener('click', () => {
            isEnabled = !isEnabled;
            updateButtonStyle(toggleButton);
            if (isEnabled) {
                hideTranslatedEntries();
            } else {
                document.querySelectorAll('.row.pt-2.mb-2').forEach(row => row.style.display = '');
            }
        });
    };

    // 更新按钮样式
    const updateButtonStyle = (button) => {
        if (isEnabled) {
            button.className = "btn btn-info btn-sm f12 me-1 fav";
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
                    <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
                </svg>
                <span>屏蔽机翻</span>
            `;
        } else {
            button.className = "btn btn-outline-info btn-sm f12 me-1 fav";
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-translate" viewBox="0 0 16 16">
                    <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
                </svg>
                <span>屏蔽机翻</span>
            `;
        }
    };

    // 隐藏含关键字的条目
    const hideTranslatedEntries = () => {
        document.querySelectorAll('.row.pt-2.mb-2').forEach(row => {
            if (row.querySelector('.bg-secondary') && row.querySelector('.bg-secondary').textContent.includes(blockKeyword)) {
                row.style.display = 'none'; // 隐藏含“机器翻译”条目
            }
        });
    };

    // 监听页面变化，动态屏蔽新增条目
    const observer = new MutationObserver(() => {
        if (isEnabled) hideTranslatedEntries();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始设置
    addToggleButton();
    if (isEnabled) hideTranslatedEntries(); // 默认启用时屏蔽
})();
