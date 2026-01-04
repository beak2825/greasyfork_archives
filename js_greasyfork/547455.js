// ==UserScript==
// @name         Bangumi 主题/日志 BBCode 快捷复制按钮
// @namespace    https://greasyfork.org/zh-CN/users/1386262-zintop
// @version      1.1.1
// @author       zintop
// @description  在主题/日志标题旁添加按钮，点击即可复制BBCode[url=链接]标题[/url]到剪切板
// @match        https://bgm.tv/group/topic/*
// @match        https://bgm.tv/blog/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://bangumi.tv/blog/*
// @match        https://chii.in/group/topic/*
// @match        https://chii.in/blog/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547455/Bangumi%20%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%20BBCode%20%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/547455/Bangumi%20%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%20BBCode%20%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = document.querySelector('#pageHeader h1');
    if (!header) return;

    const title = document.title.replace(' - Bangumi', '').trim();
    const url = window.location.href;
    const bbcode = `[url=${url}]${title}[/url]`;

    // 创建按钮
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '⭐ 点击复制';
    copyBtn.style.cssText = 'margin-left:10px; padding:2px 6px; font-size:12px; background:transparent; border:1px solid #ccc; border-radius:3px; cursor:pointer;';

    // 点击事件
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(bbcode).then(() => {
            copyBtn.textContent = '🔴 再次复制';
        }).catch(() => {
            // 兼容性处理
            const textarea = document.createElement('textarea');
            textarea.value = bbcode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            copyBtn.textContent = '🔴 再次复制';
        });
    });

    header.appendChild(copyBtn);
})();
