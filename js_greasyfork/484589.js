// ==UserScript==
// @name         Anime1.me Dislike Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license MIT
// @description  Highlight disliked anime titles on Anime1.me
// @author       CursorBot
// @match        https://anime1.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484589/Anime1me%20Dislike%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/484589/Anime1me%20Dislike%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .disliked-title { color: red !important; }
        .dislike-checkbox { margin-right: 5px; }
    `;
    document.head.appendChild(style);

    // 动态内容加载完成后的回调函数
    function addCheckboxes() {
        const titles = document.querySelectorAll('td > a');
        titles.forEach((title) => {
            const catMatch = title.href.match(/cat=(\d+)/);
            if (!catMatch) return;
            const catId = catMatch[1];

            if (title.previousSibling && title.previousSibling.classList.contains('dislike-checkbox')) {
                // 已经添加过复选框
                return;
            }

            // 创建复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'dislike-checkbox';
            checkbox.dataset.catId = catId;

            // 检查localStorage中的标记状态
            checkbox.checked = localStorage.getItem('disliked_cat_' + catId) === 'true';
            if (checkbox.checked) {
                title.classList.add('disliked-title');
            }

            // 复选框状态改变事件
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    title.classList.add('disliked-title');
                    localStorage.setItem('disliked_cat_' + this.dataset.catId, 'true');
                } else {
                    title.classList.remove('disliked-title');
                    localStorage.setItem('disliked_cat_' + this.dataset.catId, 'false');
                }
            });

            // 将复选框添加到标题旁边
            title.parentNode.insertBefore(checkbox, title);
        });
    }

    // 使用MutationObserver监视动漫列表的加载
    const observer = new MutationObserver(function(mutations, me) {
        const container = document.querySelector('table'); // 假设动漫列表在一个<table>中
        if (container) {
            addCheckboxes();
        }
    });

    // 开始监视
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();