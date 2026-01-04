// ==UserScript==
// @name         Автоматическая заглавная буква везде
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Делает первую букву заглавной и после знаков препиания в любом поле ввода на всех сайтах
// @author       eretly
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544869/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F%20%D0%B1%D1%83%D0%BA%D0%B2%D0%B0%20%D0%B2%D0%B5%D0%B7%D0%B4%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/544869/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B7%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F%20%D0%B1%D1%83%D0%BA%D0%B2%D0%B0%20%D0%B2%D0%B5%D0%B7%D0%B4%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        active: true
    };

    function getTextBeforeCaret(element) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return '';
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        return preCaretRange.toString();
    }

    function shouldCapitalize(textBefore) {
        if (!textBefore) return true;
        if (/^\s*@[a-zA-Z0-9_.-]+[,\s]\s*$/.test(textBefore)) return true;
        if (/[.!?]\s+$/.test(textBefore)) return true;
        if (/^\s*$/.test(textBefore)) return true;
        return false;
    }

    function insertCapitalizedChar(char) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        const range = selection.getRangeAt(0);
        const upperChar = char.toUpperCase();
        range.deleteContents();
        const textNode = document.createTextNode(upperChar);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
    }

    function handleContentEditableInput(event) {
        if (!settings.active) return;
        const element = event.target;
        if (!element.isContentEditable) return;
        if (event.inputType === 'insertText' && event.data) {
            const char = event.data;
            if (!/[a-zA-Zа-яёА-ЯЁ]/.test(char)) return;
            const textBefore = getTextBeforeCaret(element);
            if (shouldCapitalize(textBefore)) {
                event.preventDefault();
                insertCapitalizedChar(char);
            }
        }
    }

    function handleTextInput(event) {
        if (!settings.active) return;

        const element = event.target;

        const allowedTypes = ['text', 'search', 'url'];
        if (element.tagName === 'TEXTAREA' ||
            (element.tagName === 'INPUT' && allowedTypes.includes(element.type))) {

            const value = element.value;
            const pos = element.selectionStart;

            if (pos > 0 && element.selectionStart === element.selectionEnd) {
                const lastChar = value[pos - 1];
                const before = value.substring(0, pos - 1);
                if (/[a-zA-Zа-яёА-ЯЁ]/.test(lastChar) && shouldCapitalize(before)) {
                    const newValue = before + lastChar.toUpperCase() + value.substring(pos);
                    element.value = newValue;
                    element.setSelectionRange(pos, pos);
                }
            }
        }
    }

    function placeCursorAtEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function observeContentEditables() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                if (!el._autoCapHandled) {
                    el.addEventListener('beforeinput', handleContentEditableInput, true);
                    el._autoCapHandled = true;
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initialize() {
        document.addEventListener('beforeinput', handleContentEditableInput, true);
        document.addEventListener('input', handleTextInput, true);
        observeContentEditables();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
