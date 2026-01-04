// ==UserScript==
// @name         ChatBoxAI RTL Toggle
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Inject custom styles, add RTL toggle, and change placeholder to Uyghur for ChatBoxAI
// @match        https://web.chatboxai.app/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504956/ChatBoxAI%20RTL%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/504956/ChatBoxAI%20RTL%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式元素
    const style = document.createElement('style');
    document.head.appendChild(style);

    // 注入基本样式
    style.textContent = `
        .overflow-auto.h-full.pr-0.pl-1.sm\\:pl-0 {
            font-family: 'UKIJ EKRAN';
        }

        h6.MuiTypography-root.MuiTypography-h6.MuiTypography-noWrap.max-w-56.ml-3.css-8cgdsv {
    font-family: UKIJ EKRAN;
}

        .overflow-auto.h-full.pr-0.pl-1.sm\\:pl-0 > div:first-child {
            overflow-x: hidden;
        }

        textarea#message-input {
            font-family: 'UKIJ EKRAN' !important;
        }

        span.token {
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace, UKIJ EKRAN!important;
}

code,table {
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace, UKIJ EKRAN!important;
}

        p.MuiTypography-root.MuiTypography-inherit.MuiTypography-noWrap.css-mlawsc {
            font-family: 'UKIJ EKRAN';
        }
        #rtl-toggle {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        pre {
        direction:ltr!important;
        }

        #rtl-toggle:hover {
            background-color: #45a049;
        }
    `;

    // 创建RTL开关
    const toggle = document.createElement('button');
    toggle.id = 'rtl-toggle';
    toggle.textContent = 'RTL: Off';
    document.body.appendChild(toggle);

    // RTL开关功能
    let rtlEnabled = false;
    function toggleRTL() {
        rtlEnabled = !rtlEnabled;
        toggle.textContent = rtlEnabled ? 'RTL: On' : 'RTL: Off';

        const elements = document.querySelectorAll('.overflow-auto.h-full.pr-0.pl-1.sm\\:pl-0, textarea#message-input');
        elements.forEach(el => {
            el.style.direction = rtlEnabled ? 'rtl' : 'ltr';
        });

        // 更改placeholder文本
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.placeholder = rtlEnabled ? 'بۇ يەردە سوئالىڭىزنى كىرگۈزۈڭ...' : '在这里输入你的问题...';
            messageInput.style.direction = rtlEnabled ? 'rtl' : 'ltr';
        }
    }

    toggle.addEventListener('click', toggleRTL);

    // 监听DOM变化，确保在输入框加载后应用RTL设置
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const messageInput = document.getElementById('message-input');
                if (messageInput) {
                    messageInput.placeholder = rtlEnabled ? 'بۇ يەردە سوئالىڭىزنى كىرگۈزۈڭ...' : '在这里输入你的问题...';
                    messageInput.style.direction = rtlEnabled ? 'rtl' : 'ltr';
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
