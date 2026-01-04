// ==UserScript==
// @name         Gemini: Enterで改行、Shift+Enterで送信
// @name:en      Gemini: Enter for Newline, Shift+Enter to Send
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  PC版Geminiのチャット入力欄で、Enterキーで改行、Shift+Enterキーで送信できるようにします。
// @description:en Use Enter for a new line and Shift+Enter to send messages in the Gemini web UI chat input field.
// @author       Hayaokuri
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536815/Gemini%3A%20Enter%E3%81%A7%E6%94%B9%E8%A1%8C%E3%80%81Shift%2BEnter%E3%81%A7%E9%80%81%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/536815/Gemini%3A%20Enter%E3%81%A7%E6%94%B9%E8%A1%8C%E3%80%81Shift%2BEnter%E3%81%A7%E9%80%81%E4%BF%A1.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    const inputSelectorPrimary = 'div.ql-editor[contenteditable="true"]';
    const inputSelectorsFallback = [
        'textarea[enterkeyhint="send"]',
        'textarea[aria-label*="Prompt"]',
        'textarea[placeholder*="Message Gemini"]',
        'div[role="textbox"][contenteditable="true"]'
    ];
    const sendButtonSelector = 'button[aria-label*="Send"], button[aria-label*="送信"], button[data-test-id="send-button"]';

    let textarea = null;

    function findTextarea() {
        let el = document.querySelector(inputSelectorPrimary);
        if (el) { return el; }
        for (const selector of inputSelectorsFallback) {
            el = document.querySelector(selector);
            if (el) { return el; }
        }
        return null;
    }

    function findSendButton() {
        const selectors = [ sendButtonSelector, 'button:has(span.material-symbols-outlined:contains("send"))' ];
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }
        return null;
    }

    function handleKeydown(event) {
        if (event.target !== textarea && (!textarea || !textarea.contains(event.target))) {
            return;
        }

        if (event.key === 'Enter') {
            if (event.shiftKey) {
                event.preventDefault();
                const sendButton = findSendButton();
                if (sendButton && !sendButton.disabled) {
                    sendButton.click();
                } else {
                    const form = event.target.closest('form');
                    if (form) {
                        if (typeof form.requestSubmit === 'function') { form.requestSubmit(); } else { form.submit(); }
                    }
                }
            } else { // Enterキーのみの場合
                event.preventDefault();
                event.stopImmediatePropagation();

                const effectiveInputArea = textarea;

                if (effectiveInputArea.isContentEditable) {
                    effectiveInputArea.focus();
                    let success = document.execCommand('insertParagraph', false, null);
                    if (!success) {
                        effectiveInputArea.focus(); // 再度フォーカス
                        document.execCommand('insertHTML', false, '<br>');
                    }
                } else if (effectiveInputArea.tagName && effectiveInputArea.tagName.toUpperCase() === 'TEXTAREA') {
                    const start = effectiveInputArea.selectionStart;
                    const end = effectiveInputArea.selectionEnd;
                    effectiveInputArea.value = effectiveInputArea.value.substring(0, start) + "\n" + effectiveInputArea.value.substring(end);
                    effectiveInputArea.selectionStart = effectiveInputArea.selectionEnd = start + 1;
                }
            }
        }
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            const newTextarea = findTextarea();
            if (newTextarea) {
                if (textarea !== newTextarea || !newTextarea.dataset.keydownListenerAttached) {
                    if (textarea && textarea.dataset.keydownListenerAttached) {
                        textarea.removeEventListener('keydown', handleKeydown, true);
                        delete textarea.dataset.keydownListenerAttached;
                    }
                    textarea = newTextarea;
                    textarea.addEventListener('keydown', handleKeydown, true);
                    textarea.dataset.keydownListenerAttached = 'true';
                }
            } else {
                if (textarea && textarea.dataset.keydownListenerAttached) {
                    textarea.removeEventListener('keydown', handleKeydown, true);
                    delete textarea.dataset.keydownListenerAttached;
                    textarea = null;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const initialTextarea = findTextarea();
            if (initialTextarea && !initialTextarea.dataset.keydownListenerAttached) {
                textarea = initialTextarea;
                textarea.addEventListener('keydown', handleKeydown, true);
                textarea.dataset.keydownListenerAttached = 'true';
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(observeDOM, 0));
    } else {
        setTimeout(observeDOM, 0);
    }
})();