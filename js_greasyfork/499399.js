// ==UserScript==
// @name         縦横軸コード管理の改良
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  改行を含むペーストに対応
// @license      MIT
// @match        https://starlight.plusnao.co.jp/goods/axisCode*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499399/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/499399/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerInputEvent(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function processPastedText(inputElement, pastedText) {
        const lines = pastedText.split('\n').filter(line => line.trim() !== "");

        if (lines.length === 1) {
            const currentPosition = inputElement.selectionStart;
            const currentValue = inputElement.value;

            if (inputElement.selectionStart === 0 && inputElement.selectionEnd === currentValue.length) {
                inputElement.value = pastedText;
                inputElement.setSelectionRange(pastedText.length, pastedText.length);
            } else {
                const newValue = currentValue.slice(0, currentPosition) + pastedText + currentValue.slice(currentPosition);
                inputElement.value = newValue;
                inputElement.setSelectionRange(currentPosition + pastedText.length, currentPosition + pastedText.length);
            }
            triggerInputEvent(inputElement);
        } else {
            inputElement.value = lines[0];
            triggerInputEvent(inputElement);

            const columnIndex = Array.from(inputElement.closest('tr').children).indexOf(inputElement.closest('td'));

            for (let i = 1; i < lines.length; i++) {
                const nextRow = inputElement.closest('tr').nextElementSibling;
                if (nextRow) {
                    const nextInput = nextRow.children[columnIndex].querySelector('input.form-control');
                    if (nextInput) {
                        nextInput.value = lines[i];
                        triggerInputEvent(nextInput);
                        inputElement = nextInput;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
    }

    function handlePaste(event) {
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');

        if (pastedText.includes('\n')) {
            event.preventDefault();
            processPastedText(event.target, pastedText);
        }
    }

    function addPasteListeners() {
        document.querySelectorAll('input.form-control').forEach(input => {
            input.addEventListener('paste', handlePaste);
        });
    }

    function observeDynamicElements() {
        new MutationObserver(() => addPasteListeners()).observe(document.getElementById('axisCode'), { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        addPasteListeners();
        observeDynamicElements();
    });

})();