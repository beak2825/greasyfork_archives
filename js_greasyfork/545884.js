// ==UserScript==
// @name         WhatsApp Translator
// @name:zh-CN   WhatsApp 翻译器
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Translate selected WhatsApp messages
// @description:zh-CN 将 WhatsApp 选中的文本翻译成中文
// @author       HeT
// @match        https://web.whatsapp.com/*
// @grant        GM_xmlhttpRequest
// @connect      translator-api-lovat.vercel.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545884/WhatsApp%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/545884/WhatsApp%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetLang = 'en'; // 默认翻译成英文
    const serverUrl = 'https://translator-api-lovat.vercel.app/api/translate';

    document.body.addEventListener('click', function (e) {
        const bubble = e.target.closest('.message-in, .message-out');
        if (!bubble) return;

        const messageTextElement = bubble.querySelector('span.selectable-text');
        if (!messageTextElement) return;

        const originalText = messageTextElement.innerText.trim();
        if (!originalText) return;

        translate(originalText, false, (translated) => {
            if (translated) {
                messageTextElement.innerText = translated;
            }
        });
    });

// ========== 1. 添加翻译输入框 ==========
    function addTranslateBox() {
        const chatFooter = document.querySelector('footer');
        if (!chatFooter || document.getElementById('translator-input')) return;

        const translateBox = document.createElement('textarea');
        translateBox.id = 'translator-input';
        translateBox.placeholder = '在这里输入中文，然后猛敲回车键会翻译成英文并填充上方输入框...';
        translateBox.style.width = '100%';
        translateBox.style.height = '40px';
        translateBox.style.marginTop = '5px';
        translateBox.style.padding = '5px';
        translateBox.style.border = '1px solid #ccc';
        translateBox.style.borderRadius = '6px';
        translateBox.style.resize = 'none';

        chatFooter.appendChild(translateBox);

        // ========== 3. 回车事件 ==========
        translateBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.ctrlKey) {
                    // Ctrl+Enter 换行
                    e.preventDefault();
                    const start = translateBox.selectionStart;
                    const end = translateBox.selectionEnd;
                    translateBox.value =
                        translateBox.value.substring(0, start) + "\n" + translateBox.value.substring(end);
                    translateBox.selectionStart = translateBox.selectionEnd = start + 1;
                } else {
                    e.preventDefault();
                    const text = translateBox.value.trim();
                    if (!text) return;

                    translate(text, true, (translated) => {
                        if (translated) {
                            fillWhatsAppInput(translated); 
                            translateBox.value = ''; // 清空下方输入框
                        }
                    });
                }
            }
        });
    }


    function getWAInput() {
        return document.querySelector('[data-testid="conversation-compose-box-input"]')
        || document.querySelector('footer div[contenteditable="true"][role="textbox"]')
        || document.querySelector('footer [contenteditable="true"][data-tab]');
    }

    // 将翻译后的英文填充到 WhatsApp 输入框
    function fillWhatsAppInput(text) {
        const waInput = getWAInput();
        const translatorBox = document.getElementById('translator-input');
        if (!waInput) return;

        // 聚焦输入框
        waInput.focus();


        // 插入新的文本
        const ok = document.execCommand('insertText', false, text);

        // 如果 execCommand 失败，则用 fallback
        if (!ok) {
            waInput.textContent = text;
        }

        // 聚焦回下方翻译框，方便继续输入中文
        if (translatorBox) {
            setTimeout(() => translatorBox.focus(), 0);
        }
    }



    function translate(text, isInput, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: serverUrl,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ q: text, to: isInput ? targetLang : 'zh-CHS' }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.translation && data.translation.length) {
                        callback(data.translation[0]);
                    } else {
                        console.error("翻译API返回异常", data);
                        callback(null);
                    }
                } catch (e) {
                    console.error("解析返回数据失败", e, response.responseText);
                    callback(null);
                }
            },
            onerror: function(err) {
                console.error("请求失败", err);
                callback(null);
            }
        });
    }



    // ========== 入口 ==========
    setInterval(() => {
        addTranslateBox();

    }, 1000);



    // ==============================
    // 🔥 预热 API，避免第一次延迟
    // ==============================
    setTimeout(() => {
        translate("ping", () => {
        });
    }, 2000);

})();
