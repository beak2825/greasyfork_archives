// ==UserScript==
// @name         简历链接复制助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键复制简历链接，支持 Markdown 格式
// @author       chengpengfei05
// @match        https://zhaopin.sankuai.com/resume-details*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532814/%E7%AE%80%E5%8E%86%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532814/%E7%AE%80%E5%8E%86%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .copy-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-left: 16px;
            padding: 8px 16px;
            font-size: 14px;
            color: #1677ff;
            background: #fff;
            border: 1px solid #1677ff;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
            vertical-align: middle;
            height: 36px;
            line-height: 1;
            position: relative;
            top: -1px;
        }
        .copy-button:hover {
            color: #4096ff;
            border-color: #4096ff;
            background: #fff;
            transform: translateY(-1px);
        }
        .copy-button:active {
            transform: translateY(0);
        }
        .copy-button.copied {
            color: #52c41a;
            border-color: #52c41a;
            background: #f6ffed;
        }
        .copy-button svg {
            width: 16px;
            height: 16px;
        }
        .copy-toast {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.75);
            color: #fff;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .copy-toast.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);

    function showToast(message, duration = 2000) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            if(timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        }
    }

    function createCopyButton(name) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = `
            <svg viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM382 896h-.2L208 722.2V256h496v640H382z"/>
            </svg>
            复制链接
        `;

        button.addEventListener('click', () => {
            const markdownLink = `[${name}](${window.location.href})`;
            GM_setClipboard(markdownLink);
            button.classList.add('copied');
            showToast('链接已复制到剪贴板');
            setTimeout(() => button.classList.remove('copied'), 1000);
        });
        return button;
    }

    function init() {
        const nameSelectors = [
            "#candidate div.resume-details-basic-info-shown > div.b-info > div.b-info-n > span.b-info-name",
            ".resume-details-basic-info-shown .b-info-name"
        ];

        let nameElement = null;
        for(const selector of nameSelectors) {
            nameElement = document.querySelector(selector);
            if(nameElement) break;
        }

        if (nameElement && !nameElement.nextSibling?.classList?.contains('copy-button')) {
            const copyButton = createCopyButton(nameElement.textContent.trim());
            nameElement.parentNode.insertBefore(copyButton, nameElement.nextSibling);
        }
    }

    const debouncedInit = debounce(() => requestAnimationFrame(init), 200);

    const observer = new MutationObserver(debouncedInit);
    observer.observe(document.body, { childList: true, subtree: true });
    debouncedInit();

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(debounce(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            debouncedInit();
        }
    }, 200));
    urlObserver.observe(document, { subtree: true, childList: true });
})();
