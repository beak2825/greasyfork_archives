// ==UserScript==
// @name         I'm Pro：在 Github 页面添加 Pro 标识
// @name:zh-TW   I'm Pro：在 Github 頁面添加 Pro 標識
// @name:en      I'm Pro: Add a Github Pro badge to your Github profile
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在自己的 Github 页面个人资料页上添加 Github Pro 标识（仅本地有效）
// @description:zh-TW 在自己的 Github 頁面個人資料頁上添加 Github Pro 標識（僅本地有效）
// @description:en Add a Github Pro badge to your Github profile page (local display only)
// @author       GamerNoTitle
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525713/I%27m%20Pro%EF%BC%9A%E5%9C%A8%20Github%20%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Pro%20%E6%A0%87%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/525713/I%27m%20Pro%EF%BC%9A%E5%9C%A8%20Github%20%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%20Pro%20%E6%A0%87%E8%AF%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测是否是个人资料页
    function isProfilePage() {
        return document.querySelector('button.js-profile-editable-edit-button') !== null;
    }

    // 创建Highlights模块
    function createHighlightsSection() {
        const div = document.createElement('div');
        div.className = 'border-top color-border-muted pt-3 mt-3 d-none d-md-block';

        div.innerHTML = `
            <h2 class="h4 mb-2">Highlights</h2>
            <ul class="list-style-none">
                <li class="mt-2">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star color-fg-muted">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"/>
                    </svg>
                    <span title="Label: Pro" data-view-component="true" class="Label Label--purple text-uppercase">Pro</span>
                </li>
            </ul>
        `;
        return div;
    }

    // 主逻辑
    function main() {
        if (!isProfilePage()) return;

        // 检查Highlights是否存在
        const highlights = document.querySelector('div.border-top.color-border-muted.pt-3.mt-3.d-none.d-md-block');
        if (!highlights) {
            const container = document.querySelector('.Layout-sidebar');
            if (container) {
                const newSection = createHighlightsSection();
                container.appendChild(newSection);
            }
        } else {
            // 确保Pro标识存在
            const proBadge = highlights.querySelector('.Label--purple');
            if (!proBadge) {
                const proItem = document.createElement('li');
                proItem.className = 'mt-2';
                proItem.innerHTML = `
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star color-fg-muted">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"/>
                    </svg>
                    <span title="Label: Pro" data-view-component="true" class="Label Label--purple text-uppercase">Pro</span>
                `;
                highlights.querySelector('ul').appendChild(proItem);
            }
        }
    }

    // 页面加载后执行
    window.addEventListener('load', main);
    // 处理GitHub的异步加载
    document.addEventListener('pjax:end', main);
})();
