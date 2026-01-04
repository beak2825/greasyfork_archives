// ==UserScript==
// @name         解锁PTA复制粘贴限制
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  这个用户脚本旨在解除PTA（拼题A、Pintia）平台上的复制和粘贴限制，使用户能够自由复制和粘贴文本
// @author       MadelineCarter
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @match        https://pintia.cn/problem-sets/*/exam/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/510447/%E8%A7%A3%E9%94%81PTA%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/510447/%E8%A7%A3%E9%94%81PTA%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止弹窗
    window.alert = function() {};

    // 模拟真实键盘输入
    async function simulateRealTyping(element, text) {
        element.focus();

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            element.dispatchEvent(new KeyboardEvent('keydown', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true,
                composed: true
            }));

            element.dispatchEvent(new KeyboardEvent('keypress', {
                key: char,
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            }));

            const currentValue = element.value || '';
            const start = element.selectionStart || currentValue.length;
            const end = element.selectionEnd || currentValue.length;
            const newValue = currentValue.substring(0, start) + char + currentValue.substring(end);

            const nativeSetter = Object.getOwnPropertyDescriptor(
                element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
                'value'
            ).set;
            nativeSetter.call(element, newValue);

            element.selectionStart = element.selectionEnd = start + 1;

            element.dispatchEvent(new InputEvent('input', {
                data: char,
                inputType: 'insertText',
                bubbles: true,
                cancelable: false,
                composed: true
            }));

            element.dispatchEvent(new KeyboardEvent('keyup', {
                key: char,
                code: 'Key' + char.toUpperCase(),
                charCode: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                which: char.charCodeAt(0),
                bubbles: true,
                cancelable: true
            }));

            await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
        }

        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // CodeMirror编辑器
    async function simulateCodeMirrorTyping(cm, text) {
        if (cm.setValue) {
            cm.setValue('');
        } else if (cm.dispatch) {
            cm.dispatch({
                changes: {from: 0, to: cm.state.doc.length, insert: ''}
            });
        }

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (cm.replaceSelection) {
                cm.replaceSelection(char);
            } else if (cm.dispatch) {
                const state = cm.state;
                const pos = state.selection.main.head;
                cm.dispatch({
                    changes: {from: pos, insert: char}
                });
            }

            await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
        }
    }

    // 监听粘贴事件 - 捕获阶段优先处理
    document.addEventListener('paste', async function(e) {
        const target = e.target;

        // 只处理输入框
        if (target.tagName !== 'TEXTAREA' &&
            target.tagName !== 'INPUT' &&
            !target.classList.contains('CodeMirror') &&
            target.contentEditable !== 'true') {
            return;
        }

        // 阻止网站的粘贴拦截
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        try {
            const text = await navigator.clipboard.readText();
            if (!text) return;

            // 模拟输入
            if (target.classList.contains('CodeMirror') && target.CodeMirror) {
                await simulateCodeMirrorTyping(target.CodeMirror, text);
            } else if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                await simulateRealTyping(target, text);
            } else if (target.contentEditable === 'true') {
                for (let char of text) {
                    document.execCommand('insertText', false, char);
                    await new Promise(r => setTimeout(r, Math.random() * 10));
                }
            }
        } catch(err) {
            console.error(err);
        }
    }, true);

    // 监听 Ctrl+V
    document.addEventListener('keydown', async function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            const target = e.target;

            // 只处理输入框
            if (target.tagName !== 'TEXTAREA' &&
                target.tagName !== 'INPUT' &&
                !target.classList.contains('CodeMirror') &&
                target.contentEditable !== 'true') {
                return;
            }

            // 阻止默认行为
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            try {
                const text = await navigator.clipboard.readText();
                if (!text) return;

                // 模拟输入
                if (target.classList.contains('CodeMirror') && target.CodeMirror) {
                    await simulateCodeMirrorTyping(target.CodeMirror, text);
                } else if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
                    await simulateRealTyping(target, text);
                } else if (target.contentEditable === 'true') {
                    for (let char of text) {
                        document.execCommand('insertText', false, char);
                        await new Promise(r => setTimeout(r, Math.random() * 10));
                    }
                }
            } catch(err) {
                console.error(err);
            }
        }
    }, true);

})();
/*
    This script is not licensed for use, modification, or distribution.
    All rights are reserved by the author.
*/