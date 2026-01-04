// ==UserScript==
// @name         GitHub SSH Clone 加速镜像域名替换
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 SSH clone 输入框下方显示替换域名后的链接
// @author       speedhub
// @match        https://github.com/*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/535852/GitHub%20SSH%20Clone%20%E5%8A%A0%E9%80%9F%E9%95%9C%E5%83%8F%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/535852/GitHub%20SSH%20Clone%20%E5%8A%A0%E9%80%9F%E9%95%9C%E5%83%8F%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertCustomCloneLink() {
        // 找到SSH clone输入框
        const sshInput = document.querySelector('input#clone-with-ssh');
        if (!sshInput) return;

        // 检查是否已经插入过
        if (document.getElementById('custom-clone-link-line')) return;

        // 只处理git@github.com:开头的情况
        const oldVal = sshInput.value;
        if (!oldVal.startsWith('git@github.com:')) return;

        // 替换域名
        const newVal = oldVal.replace(/^git@github\.com:/, 'git@git.zhlh6.cn:');

        // 构造一行新的DOM
        const newDiv = document.createElement('div');
        newDiv.id = 'custom-clone-link-line';
        newDiv.style.marginTop = '8px';
        newDiv.style.display = 'flex';
        newDiv.style.alignItems = 'center';

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.setAttribute('data-component', 'IconButton');
        copyBtn.type = 'button';
        copyBtn.className = 'Box-sc-g0xbh4-0 kZDjtE prc-Button-ButtonBase-c50BI ml-1 mr-0 prc-Button-IconButton-szpyj';
        copyBtn.setAttribute('data-loading', 'false');
        copyBtn.setAttribute('data-no-visuals', 'true');
        copyBtn.setAttribute('data-size', 'medium');
        copyBtn.setAttribute('data-variant', 'invisible');
        copyBtn.innerHTML = `
            <svg aria-hidden="true" focusable="false" class="octicon octicon-copy" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
            </svg>
        `;

        // 绑定复制事件
        copyBtn.addEventListener('click', function() {
            inputBox.select();
            document.execCommand('copy');
            // 可选：给个反馈
            copyBtn.innerHTML = '✔️';
            setTimeout(() => {
                copyBtn.innerHTML = `
                    <svg aria-hidden="true" focusable="false" class="octicon octicon-copy" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;">
                        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                    </svg>
                `;
            }, 1000);
        });

        // 显示内容
        const inputBox = document.createElement('input');
        inputBox.type = 'text';
        inputBox.readOnly = true;
        inputBox.value = newVal;
        inputBox.style.flexGrow = '1';
        inputBox.className = 'form-control input-monospace input-sm color-bg-subtle';

        newDiv.appendChild(inputBox);
        newDiv.appendChild(copyBtn);

        // 插入到ssh输入框下方
        const parentDiv = sshInput.closest('div.d-flex.mb-2') || sshInput.parentElement;
        parentDiv.parentNode.insertBefore(newDiv, parentDiv.nextSibling);
    }

    // 监听DOM变化以应对GitHub的动态加载
    const observer = new MutationObserver(insertCustomCloneLink);
    observer.observe(document.body, { childList: true, subtree: true });

    // 首次执行
    insertCustomCloneLink();
})();
