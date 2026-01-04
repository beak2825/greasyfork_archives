// ==UserScript==
// @name         LeetCode题目转Markdown
// @version      2025-02-01
// @description  将LeetCode题目转换为Markdown格式
// @author       forward
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @namespace https://greasyfork.org/users/1429541
// @downloadURL https://update.greasyfork.org/scripts/525440/LeetCode%E9%A2%98%E7%9B%AE%E8%BD%ACMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/525440/LeetCode%E9%A2%98%E7%9B%AE%E8%BD%ACMarkdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = false;
    let markdownText = '';

    const style = document.createElement('style');
    style.textContent = `
        .leetcode2md-loading{display:inline-block;width:12px;height:12px;border:2px solid currentColor;border-radius:50%;border-top-color:transparent;animation:spin .8s linear infinite;opacity:.7}
        .leetcode2md-success{position:fixed;top:20px;right:20px;background:var(--success-color,#52c41a);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,.15);animation:slideIn .3s ease,fadeOut .3s ease 2s forwards}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
    `;
    document.head.appendChild(style);

    const htmlToMarkdown = (() => {
        const rules = [
            [/<pre>([\s\S]*?)<\/pre>/g, '```\n$1\n```'],
            [/<ul>|<\/ul>/g, ''],
            [/<li>/g, '- '],
            [/<\/li>/g, '\n'],
            [/<p>([\s\S]*?)<\/p>/g, '$1\n'],
            [/<strong>([\s\S]*?)<\/strong>/g, '**$1**'],
            [/<code>([\s\S]*?)<\/code>/g, '`$1`'],
            [/&nbsp;/g, ' '],
            [/<img[^>]+alt="([^"]*)"[^>]+src="([^"]+)"[^>]*>/g, '![$1]($2)'],
            [/<[^>]+>/g, ''],
            [/\n{2,}/g, '\n\n']
        ];

        return html => rules.reduce((text, [pattern, replacement]) =>
            text.replace(pattern, replacement), html).trim();
    })();

    const showSuccessMessage = (() => {
        let currentMessage = null;
        return () => {
            if (currentMessage) {
                currentMessage.remove();
            }
            currentMessage = document.createElement('div');
            currentMessage.className = 'leetcode2md-success';
            currentMessage.textContent = '✓ 已复制到剪贴板';
            document.body.appendChild(currentMessage);
            setTimeout(() => {
                currentMessage.remove();
                currentMessage = null;
            }, 2500);
        };
    })();

    function initPlugin() {
        const maxAttempts = 10;
        let attemptCount = 0;

        const tryInit = () => {
            if (attemptCount++ >= maxAttempts) return;

            const titleContainer = document.querySelector('.text-title-large')?.parentElement;
            if (!titleContainer) {
                setTimeout(tryInit, 500);
                return;
            }

            if (titleContainer.querySelector('.leetcode2md-btn')) return;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'flex items-center mt-2';

            const btnWrapper = document.createElement('div');
            btnWrapper.className = 'leetcode2md-btn relative inline-flex items-center justify-center text-caption px-2 py-1 gap-1 rounded-full bg-fill-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary text-sd-secondary-foreground hover:opacity-80';
            btnWrapper.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="h-3.5 w-3.5">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                ToMD
            `;

            buttonContainer.appendChild(btnWrapper);
            titleContainer.appendChild(buttonContainer);

            btnWrapper.addEventListener('click', async function() {
                if (this.classList.contains('loading')) return;

                const originalHTML = this.innerHTML;
                this.innerHTML = '<div class="leetcode2md-loading"></div>处理中...';
                this.classList.add('loading');

                try {
                    const title = document.querySelector('.text-title-large').textContent.trim();
                    const content = document.querySelector("[data-track-load='description_content']").innerHTML;

                    await navigator.clipboard.writeText(`# ${title}\n${htmlToMarkdown(content)}`);
                    showSuccessMessage();
                } catch (error) {
                    this.textContent = '转换失败';
                    setTimeout(() => this.innerHTML = originalHTML, 2000);
                } finally {
                    this.classList.remove('loading');
                    this.innerHTML = originalHTML;
                }
            });
        };

        tryInit();
    }

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
    };

    window.addEventListener('load', initPlugin);

    let lastUrl = location.href;
    new MutationObserver(debounce(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initPlugin, 500);
        }
    }, 250)).observe(document, { subtree: true, childList: true });
})();