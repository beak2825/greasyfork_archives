// ==UserScript==
// @name         AMZ123关键词小写化
// @namespace    none
// @version      1.0
// @description  将输入框中的关键词转为小写，并在点击搜索按钮或按回车时保证小写跳转。
// @author       jayvzh
// @license      GPL-3.0
// @match        https://www.amz123.com/*topkeywords*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512923/AMZ123%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B0%8F%E5%86%99%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512923/AMZ123%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B0%8F%E5%86%99%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function initScript() {
        const inputBox = document.querySelector('.search-input input');
        const searchBtnBox = document.querySelector('.search-btn-box');

        if (inputBox && searchBtnBox) {
            // 输入框监听：输入或粘贴时，将内容转换为小写
            inputBox.addEventListener('input', () => {
                inputBox.value = inputBox.value.toLowerCase();
            });

            // 通用跳转逻辑：确保输入内容转为小写并跳转
            function performSearch() {
                const searchQuery = inputBox.value.toLowerCase();
                const targetURL = `https://www.amz123.com/usatopkeywords/1?k=${encodeURIComponent(searchQuery)}`;
                window.location.href = targetURL;
            }

            // 按钮点击事件监听
            searchBtnBox.addEventListener('click', (event) => {
                event.preventDefault();
                performSearch();
            });

            // 监听回车键事件
            inputBox.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    performSearch();
                }
            });
        }
    }

    // 使用 MutationObserver 监控页面内容变化
    const observer = new MutationObserver(() => {
        initScript();
    });

    // 开始观察整个页面
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次运行时立即执行一次初始化
    initScript();
})();
