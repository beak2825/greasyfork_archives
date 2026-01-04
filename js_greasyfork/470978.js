// ==UserScript==
// @name         ybt系列一键复制
// @namespace    http://tampermonkey.net/
// @namespace    https://www.luogu.com.cn/user/545986
// @version      0.2.1
// @description  为ybt系列中的代码块（如样例）添加一键复制按钮
// @match        http://ybt.ssoier.cn:8088/*
// @match        http://oj.woj.ac.cn:8088/*
// @match        http://bas.ssoier.cn:8086/*
// @match        http://woj.ssoier.cn:8087/*
// @author       Jerrycyx,ChatGPT
// @license      Mozilla
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470978/ybt%E7%B3%BB%E5%88%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/470978/ybt%E7%B3%BB%E5%88%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Add custom CSS styles
    GM_addStyle(`
        .copy-button {
            position: relative;
            display: inline-block;
            background: #e8e8e8;
            border: 1px solid #ccc;
            border-radius: 5px;
            color: #000;
            padding: 3px 10px;
            transition: background 0.3s ease;
            cursor: pointer;
            margin-top: 10px; /* Added this line to move the button 1px down */
            margin-bottom: -5px;
        }
        .copy-button:hover {
            background: #ccc;
        }
        .copy-button::after {
            content: '复制';
        }
        .copy-button.success {
            background: #8bc34a;
        }
        .copy-button.success::after {
            content: '成功';
        }
    `);
    // Create the copy button
    function createCopyButton(element) {
        var button = document.createElement('button');
        button.classList.add('copy-button');
        button.addEventListener('click', function() {
            copyText(element.textContent);
            button.classList.add('success');
            setTimeout(function() {
                button.classList.remove('success');
            }, 500);
        });
        return button;
    }
    // Copy text to clipboard
    function copyText(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    // Find all code blocks and add copy buttons
    var codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(function(block) {
        var button = createCopyButton(block);
        var parent = block.parentNode;
        parent.insertBefore(button, block);
    });
})();