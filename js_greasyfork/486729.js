// ==UserScript==
// @name         GitHub Repo Markdown Link Copier
// @namespace    https://dvel.me/github-repo-markdown-link-copier
// @version      1.0
// @description  Add a copy button to GitHub repos to copy the repo link in markdown format
// @author       Dvel
// @match        https://github.com/*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/486729/GitHub%20Repo%20Markdown%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/486729/GitHub%20Repo%20Markdown%20Link%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG图标
    const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`;
    const checkedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 0-.708 0L7 9.793 3.854 6.646a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l6.5-6.5a.5.5 0 0 0 0-.708z"/></svg>`;

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0 || mutation.type === 'childList') {
                const navList = document.querySelector('nav[role="navigation"][aria-label="Page context"] ul');
                const existingButton = document.querySelector('#custom-copy-button');
                if (navList && !existingButton) {
                    addCopyButton();
                }
            }
        });
    });

    // 观察器配置：观察子节点的变化
    const config = { childList: true, subtree: true };

    // 监听页面加载事件，然后开始观察DOM变化
    window.addEventListener('load', () => {
        observer.observe(document.body, config);
    });

    function addCopyButton() {
        // 定位到GitHub页面导航栏的ul元素
        const navList = document.querySelector('nav[role="navigation"][aria-label="Page context"] ul');
        if (!navList) return;

        // 获取仓库的用户名和名称
        const pathParts = document.location.pathname.split('/').filter(Boolean);
        const repoFullName = document.location.pathname.substring(1);
        const repoUrl = window.location.href;


        // 创建按钮和设置样式
        const listItem = document.createElement('li');
        listItem.id = 'custom-copy-button'; // 确保按钮唯一性
        const copyButton = document.createElement('button');
        copyButton.innerHTML = `${copyIconSVG} Copy`;
        styleButton(copyButton); // 应用样式

        // 点击按钮复制Markdown链接
        copyButton.onclick = function() {
            const markdownLink = `[${pathParts[0]}/${pathParts[1]}](${repoUrl})`;
            GM_setClipboard(markdownLink);
            copyButton.innerHTML = `${checkedIconSVG} Copied!`;
            setTimeout(() => { copyButton.innerHTML = `${copyIconSVG} copy`; }, 10000);
        };

        listItem.appendChild(copyButton);
        navList.appendChild(listItem);
    }

    // 应用按钮样式，模仿GitHub风格
    function styleButton(button) {
        button.style.padding = '5px 10px';
        button.style.fontSize = '12px';
        button.style.fontWeight = '600';
        button.style.lineHeight = '20px';
        button.style.color = '#24292e';
        button.style.backgroundColor = '#eff3f6';
        button.style.border = '1px solid rgba(27,31,35,.15)';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '8px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '5px';

        button.onmouseover = function() {
            this.style.backgroundColor = '#e1e4e8';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#eff3f6';
        };
    }
})();
