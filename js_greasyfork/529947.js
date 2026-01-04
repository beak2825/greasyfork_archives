// ==UserScript==
// @name         Dont fuck my clipboard
// @namespace    https://github.com/KoishiMoe/dont-fxxk-my-clipboard/
// @version      0.5.2
// @description  Prevents some annoying websites from fucking your clipboard
// @description:zh-CN 阻止一些恶心网站篡改你的剪贴板
// @author       KoishiMoe & Gemini
// @license       Unlicense
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0
// @resource     toastifyCSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @match        *://m.bilibili.com/*
// @match        *://*.lofter.com/*
// @match        *://*.123pan.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://*.baidu.com/*
// @include      /\.123\d{3}\.com\//
// @include      /\.lanzou\w\.com\//
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/529947/Dont%20fuck%20my%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/529947/Dont%20fuck%20my%20clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText('toastifyCSS'));

    function showToast(message, type = 'success') {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false,
            style: {
                background: type === 'success' ? "linear-gradient(to right, #00b09b, #96c93d)" :
                           type === 'error' ? "#f93154" :
                                              "#f39c12", // warning color
            }
        }).showToast();
    }

    // Method 1: Overriding clipboard methods (more robust)
    const originalClipboard = {
        write: navigator.clipboard.write.bind(navigator.clipboard),
        writeText: navigator.clipboard.writeText.bind(navigator.clipboard)
    };

    navigator.clipboard.write = async function() {
        console.warn('Clipboard write attempt blocked (using write method).');
        showToast(getTranslatedMessage('Blocked an attempt to change your clipboard!'), 'error');
        return Promise.resolve();
    };

    navigator.clipboard.writeText = async function() {
        console.warn('Clipboard write attempt blocked (using writeText method).');
        showToast(getTranslatedMessage('Blocked an attempt to change your clipboard!'), 'error');
        return Promise.resolve();
    };

    // Method 2: Overriding document.execCommand (less robust, but catches some cases)
    let originalExecCommand = null;
    try {
        originalExecCommand = document.execCommand;
    } catch (err) {
        console.warn("Could not capture original execCommand:", err);
    }

    document.execCommand = function(command) {
        if (command === 'copy') {
            console.warn('Clipboard copy attempt blocked (using execCommand).');
            showToast(getTranslatedMessage('Blocked an attempt to hijack your copy action!'), 'error');
            return false;
        }

        // If need to use execCommand for other commands
        if (originalExecCommand) {
            return originalExecCommand.apply(document, arguments);
        } else {
            console.warn("Original execCommand not available. Cannot execute:", command);
            return false;
        }
    };

    // Method 3: Event listener (less robust, but might catch some cases)
    window.addEventListener('beforeunload', function (e) {
        console.warn("Clipboard modified before unload, likely an unwanted attempt. Operation not blocked by this event.");
        // There is almost no possibility to block it at this stage
    });

    window.addEventListener('copy', function (e) {
        e.stopImmediatePropagation(); // Try to stop other listeners
        console.warn("Copy event intercepted. Modification prevented (hopefully).");
        showToast(getTranslatedMessage('Stopped a sneaky attempt to change your copied content!'), 'warning');
    });

    window.addEventListener('cut', function (e) {
        console.warn('Cut event triggered, likely legitimate user action.');
        showToast(getTranslatedMessage('You cut some text.'), 'success');
    });

    console.log('Clipboard protection loaded');

    function getTranslatedMessage(message) {
        const translations = {
            'Blocked an attempt to change your clipboard!': {
                'zh-CN': '已阻止网站修改剪贴板'
            },
            'Blocked an attempt to hijack your copy action!': {
                'zh-CN': '已阻止网站劫持复制操作'
            },
            'Stopped a sneaky attempt to change your copied content!': {
                'zh-CN': '已阻止网站修改复制内容'
            },
            'You cut some text. Everything\'s normal!': {
                'zh-CN': '您剪切了一些文本'
            }
        };

        const language = navigator.language;
        if (translations[message] && translations[message][language]) {
            return translations[message][language];
        }
        return message; // Default to English if no translation found
    }
})();