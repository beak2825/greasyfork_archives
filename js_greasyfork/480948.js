// ==UserScript==
// @name         Cver Paper Downloader
// @version      0.3.1
// @description  实现知识星球内的论文分享一键跳转，仅适配Cver，需要科学上网
// @author       Curtains
// @match        *://*.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zsxq.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1224766
// @downloadURL https://update.greasyfork.org/scripts/480948/Cver%20Paper%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480948/Cver%20Paper%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOGIN_PHRASE  = '星球禁止搜索和分享';
    const TOPIC_PREFIX  = 'https://wx.zsxq.com/topic/';
    const button = document.createElement('button');

    button.id = 'cverPaperBtn';
    button.style.cssText = `
        position: fixed;
        left: 50px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
        display: none;   /* 初始隐藏 */
    `;

    function isNotLoggedIn() {
        const text = document.body.innerText || '';
        console.log('[CverDownloader] 登录提示：', text.includes(LOGIN_PHRASE));
        return text.includes(LOGIN_PHRASE);
    }

    function onTopicClick() {
        const fileNameDiv = document.querySelector('.file-name');
        if (!fileNameDiv) {
            button.innerText = '未找到 .file-name';
            return;
        }
        let name = fileNameDiv.innerText.trim();
        const idx = name.indexOf('】');
        if (idx !== -1) name = name.slice(idx + 1).trim();
        name = name.replace(/\.pdf$/i, '');

        navigator.clipboard.writeText(name)
            .then(() => button.innerText = '文件名已复制')
            .catch(() => button.innerText = '复制失败');

        setTimeout(() => {
            window.open('https://duckduckgo.com/?q=!ducky+' + encodeURIComponent(name),
                        '_blank', 'noopener,noreferrer');
        }, 800);
    }

    function initButton() {
        // 先确保 append，只 append 一次
        if (!document.body.contains(button)) {
            document.body.appendChild(button);
        }

        if (isNotLoggedIn()) {
            button.style.display = 'block';
            button.innerText = '需登录后查看，点击去登录';
            button.onclick = () => {
                window.open('https://wx.zsxq.com/login', '_blank');
                setTimeout(() => location.reload(), 10_000);
            };
        }
        else if (location.href.startsWith(TOPIC_PREFIX)) {
            button.style.display = 'block';
            button.innerText = '跳转paper';
            button.onclick = onTopicClick;
        }
        else {
            button.style.display = 'none';
        }
    }

    // 先跑一次，接着再 observer
    initButton();
    const obs = new MutationObserver(() => {
        if (isNotLoggedIn() || location.href.startsWith(TOPIC_PREFIX)) {
            initButton();
            obs.disconnect();
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 5_000);
})();