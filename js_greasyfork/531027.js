// ==UserScript==
// @name         搜索本地番号2.0
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在指定网站添加搜索按钮，点击用Everything搜索番号
// @author       You
// @match        *://*.javdb*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531027/%E6%90%9C%E7%B4%A2%E6%9C%AC%E5%9C%B0%E7%95%AA%E5%8F%B720.user.js
// @updateURL https://update.greasyfork.org/scripts/531027/%E6%90%9C%E7%B4%A2%E6%9C%AC%E5%9C%B0%E7%95%AA%E5%8F%B720.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 域名验证：仅限javdb子站
    if (!/^(.*\.)?javdb[\d]*\.com$/.test(location.hostname)) return;

    // 创建搜索按钮
    function createSearchButton(code) {
        const button = document.createElement('a');
        button.className = 'button is-white search-everything';
        button.style.marginLeft = '5px'; // 添加间距
        button.title = '搜索番号';

        const icon = document.createElement('span');
        icon.className = 'icon is-small';
        icon.innerHTML = '<i class="icon-search"></i>';

        button.appendChild(icon);
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `es:${code}`;
        });
        return button;
    }

    // 添加搜索按钮（仅限番号）
    function addSearchButtons() {
        document.querySelectorAll('.copy-to-clipboard').forEach(button => {
            const code = button.dataset.clipboardText;

            // 验证番号格式（字母+数字组合，如ABC-123）
            if (/^[a-zA-Z]{2,}-\d{2,}$/.test(code)) {
                // 防止重复添加按钮
                if (!button.nextElementSibling?.classList?.contains('search-everything')) {
                    button.after(createSearchButton(code));
                }
            }
        });
    }

    // 增强复制功能
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.copy-to-clipboard');
        if (btn) {
            e.preventDefault();
            try {
                await navigator.clipboard.writeText(btn.dataset.clipboardText);
            } catch (err) {
                console.error('复制失败:', err);
            }
        }
    });

    // 初始化：延时执行确保元素加载完成
    setTimeout(addSearchButtons, 500);
    // 监听动态内容变化
    new MutationObserver(addSearchButtons).observe(document.body, {
        childList: true,
        subtree: true
    });
})();