// ==UserScript==
// @name         Bangumi 主题/日志 BBCode 快捷键复制
// @namespace    https://greasyfork.org/zh-CN/users/1386262-zintop
// @version      1.1.1
// @author       zintop
// @description  通过键盘快捷键直接将[url=链接]标题[/url]复制到剪贴板，修改代码即可自定义快捷键。
// @match        https://bgm.tv/group/topic/*
// @match        https://bgm.tv/blog/*
// @match        https://bangumi.tv/group/topic/*
// @match        https://bangumi.tv/blog/*
// @match        https://chii.in/group/topic/*
// @match        https://chii.in/blog/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547454/Bangumi%20%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%20BBCode%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547454/Bangumi%20%E4%B8%BB%E9%A2%98%E6%97%A5%E5%BF%97%20BBCode%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** ==== 用户可自定义快捷键 ====
     * 支持修改下面三个布尔值和按键字母
     * 例如：Alt+W → { alt: true, ctrl: false, shift: false, key: 'w' }
     *       Ctrl+Shift+C → { alt: false, ctrl: true, shift: true, key: 'c' }
     */
    const HOTKEY = {
        alt: false,
        ctrl: false,
        shift: true,
        key: 'v'   // 注意：小写字母
    };
    /** ============================ */

    const title = document.title.replace(' - Bangumi', '').trim();
    const url = window.location.href;
    const bbcode = `[url=${url}]${title}[/url]`;

    function showNotice(text) {
        const notice = document.createElement('div');
        notice.textContent = text;
        notice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #40E0D0;
            color: white;
            padding: 6px 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 13px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(notice);
        requestAnimationFrame(() => notice.style.opacity = '1');
        setTimeout(() => {
            notice.style.opacity = '0';
            setTimeout(() => notice.remove(), 500);
        }, 1500);
    }

    function copyBBCode() {
        navigator.clipboard.writeText(bbcode).then(() => {
            showNotice('✅ BBCode 已复制');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = bbcode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotice('✅ BBCode 已复制');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey === HOTKEY.alt &&
            e.ctrlKey === HOTKEY.ctrl &&
            e.shiftKey === HOTKEY.shift &&
            e.key.toLowerCase() === HOTKEY.key) {
            e.preventDefault();
            copyBBCode();
        }
    });
})();
