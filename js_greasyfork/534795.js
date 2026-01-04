// ==UserScript==
// @name         縦横軸コード管理ページエラーチェック
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  縦横軸コード管理ページでbyte数やスペース・記号・機種依存文字を検出し、それらが含まれる場合はSKUを追加できないようにする
// @license      MIT
// @match        *://starlight.plusnao.co.jp/goods/axisCode*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534795/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%A8%E3%83%A9%E3%83%BC%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/534795/%E7%B8%A6%E6%A8%AA%E8%BB%B8%E3%82%B3%E3%83%BC%E3%83%89%E7%AE%A1%E7%90%86%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%A8%E3%83%A9%E3%83%BC%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentCode = '';
    let saveButton = null;
    let modalSaveButtons = [];
    const alertBoxId = 'custom-alert-box';
    let alertTypesSet = new Set();

    function countByte(str) {
        if (!str) return 0;
        let length = 0;
        for (let char of str) {
            length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
        }
        return length;
    }

    function containsSpace(str) {
        return /[\u0020\u3000]/.test(str || '');
    }

    function containsSymbols(str) {
        return /['&<>=+\*\/\]\[\\㎜㎝㎞㎎㎏㏄]/.test(str || '');
    }

    function hasInvalidChar(str) {
        const allowedCharsOnly = /^[a-zA-Z0-9\- 　]*$/;
        return !allowedCharsOnly.test(str || '');
    }

    function highlightAxis(str) {
        return countByte(str) >= 33 || containsSpace(str) || containsSymbols(str);
    }

    function highlightCode(inputValue) {
        const combined = (currentCode || '') + (inputValue || '');

        return countByte(combined) >= 21 || containsSpace(combined) || hasInvalidChar(inputValue);
    }

    function applyHighlight(input, conditionFn, color) {
        if (!input || typeof input.value !== 'string') return;

        const value = input.value;
        const combined = (currentCode || '') + value;
        const hasInvalid = hasInvalidChar(value);

        let shouldHighlight = false;

        try {
            shouldHighlight = conditionFn(value);
            input.style.border = shouldHighlight ? `2px solid red` : '';
        } catch (e) {}

        if (!shouldHighlight) {
            if (countByte(value) < 33) alertTypesSet.delete('over33');
            if (countByte(combined) < 21) alertTypesSet.delete('over21');
            if (!containsSpace(value)) alertTypesSet.delete('space');
            if (!containsSymbols(value)) alertTypesSet.delete('symbol');
            if (!hasInvalid) alertTypesSet.delete('invalidChar');
        }

        if (shouldHighlight) {
            if (countByte(value) >= 33) alertTypesSet.add('over33');
            if (countByte(combined) >= 21) alertTypesSet.add('over21');
            if (containsSpace(value)) alertTypesSet.add('space');
            if (containsSymbols(value)) alertTypesSet.add('symbol');
            if (hasInvalid) alertTypesSet.add('invalidChar');
        }

        updateAlertMessages();
    }


    function updateSaveButtonsState() {
        try {
            const hasBadInput = Array.from(document.querySelectorAll('input.form-control')).some(input =>
                input &&
                typeof input.style.border === 'string' &&
                (
                    input.style.border.includes('red') ||
                    input.style.border.includes('blue')
                )
            );

            if (saveButton) {
                saveButton.disabled = hasBadInput;
            }

            modalSaveButtons.forEach(btn => {
                btn.disabled = hasBadInput;
            });
        } catch (e) {
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #${alertBoxId} {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f8d7da;
            border: 1px solid #e57373;
            border-radius: 12px;
            padding: 15px 20px;
            z-index: 9999;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            max-width: 400px;
            line-height: 1.6;
            color: #721c24;
            font-family: "Helvetica Neue", Arial, sans-serif;
        }

        #${alertBoxId} span {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: #fff;
            text-align: center;
            line-height: 30px;
            border-radius: 50%;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.2s;
        }

        #${alertBoxId} span:hover {
            background-color: #d32f2f;
            transform: scale(1.1);
        }

        #${alertBoxId} div {
            margin-bottom: 5px;
            margin-top: 5px;
        }
    `;

    document.head.appendChild(style);

    function updateAlertMessages() {
        let alertBox = document.getElementById(alertBoxId);

        const messages = [];
        if (alertTypesSet.has('space')) messages.push('・コード、または項目名にスペースが含まれています。');
        if (alertTypesSet.has('symbol')) messages.push('・項目名に機種依存文字か半角記号が含まれています。');
        if (alertTypesSet.has('over33')) messages.push('・項目名が32byteを超えています。<br>　32byte以内に収めてください。');
        if (alertTypesSet.has('over21')) messages.push('・代表商品コード+SKUが20byteを超えています。<br>　20byte以内に収めてください。');
        if (alertTypesSet.has('invalidChar')) messages.push('・コードに使用できない文字が含まれています。');

        if (messages.length === 0) {
            if (alertBox) {
                alertBox.remove();
            }
            return;
        }

        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = alertBoxId;
            document.body.appendChild(alertBox);
        }

        let newMessagesHTML = messages.map(msg => `<div>${msg}</div>`).join('');
        alertBox.innerHTML = `<span onclick="this.parentNode.remove()">×</span>` + newMessagesHTML;
    }

    function recalculateAllAlerts() {
        alertTypesSet.clear();

        document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
            const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
            if (axisInput) {
                const value = axisInput.value || '';
                if (countByte(value) >= 33) alertTypesSet.add('over33');
                if (containsSpace(value)) alertTypesSet.add('space');
                if (containsSymbols(value)) alertTypesSet.add('symbol');
            }
        });

        document.querySelectorAll('div.modal-content').forEach(modal => {
            const inputs = modal.querySelectorAll('input.form-control');
            if (inputs.length > 0) {
                const first = inputs[0]?.value || '';
                const second = inputs[1]?.value || '';

                if (countByte(currentCode + first) >= 21) alertTypesSet.add('over21');

                if (countByte(second) >= 33) alertTypesSet.add('over33');

                if (containsSpace(first)) alertTypesSet.add('space');
                if (containsSpace(second)) alertTypesSet.add('space');

                if (containsSymbols(second)) alertTypesSet.add('symbol');
                if (hasInvalidChar(first)) alertTypesSet.add('invalidChar');

            }
        });

        updateAlertMessages();
        updateSaveButtonsState();
    }

    function attachListeners(input, conditionFn) {
        if (!input || input.dataset.hasListener) return;

        const handler = () => {
            applyHighlight(input, conditionFn);
            recalculateAllAlerts();
            updateSaveButtonsState();
        };

        input.addEventListener('input', handler);
        handler();
        input.dataset.hasListener = 'true';
    }

    function extractCodeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        currentCode = urlParams.get('code') || '';
    }

    function detectSaveButtons() {
        const buttons = document.querySelectorAll('div.row10.mb10 button.btn.btn-primary');
        saveButton = Array.from(buttons).find(btn => btn.textContent.includes('項目名保存')) || null;

        modalSaveButtons = Array.from(document.querySelectorAll('div.modal-footer button.btn-primary'))
            .filter(btn => btn.textContent.includes('保存'));
    }

    function highlightInputs() {
        try {
            extractCodeFromUrl();
            detectSaveButtons();

            const modal = document.getElementById('modalAxisCodeInsertForm');
            const isModalVisible = modal && modal.style.display === 'block';

            if (!isModalVisible) {
                document.querySelectorAll('table.table-bordered tbody tr').forEach(tr => {
                    const axisInput = tr?.children?.[1]?.querySelector('input.form-control');
                    if (axisInput) {
                        attachListeners(axisInput, highlightAxis);
                    }
                });
            }

            document.querySelectorAll('div.modal-content').forEach(modal => {
                const modalInputs = modal.querySelectorAll('input.form-control');
                const codeInput = modalInputs[0];
                const axisInput = modalInputs[1];

                if (codeInput) attachListeners(codeInput, highlightCode);
                if (axisInput) attachListeners(axisInput, highlightAxis);
            });
        } catch (e) {}
    }

    function clearModalHighlights(modal) {
        if (!modal) return;
        modal.querySelectorAll('input.form-control').forEach(input => {
            input.style.border = '';
        });
    }

    function observeDynamicElements() {
        new MutationObserver(() => {
            highlightInputs();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        observeModalDisplayState();
    }

    function observeModalDisplayState() {
        const modal = document.getElementById('modalAxisCodeInsertForm');
        if (!modal) return;

        let previousDisplay = modal.style.display;

        new MutationObserver(() => {
            const currentDisplay = modal.style.display;

            if (previousDisplay !== currentDisplay) {
                previousDisplay = currentDisplay;

                if (currentDisplay === 'none') {
                    clearModalHighlights(modal);
                    recalculateAllAlerts();
                    updateSaveButtonsState();
                } else {
                    highlightInputs();
                    recalculateAllAlerts();
                    updateSaveButtonsState();
                }
            }
        }).observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    window.addEventListener('load', () => {
        highlightInputs();
        observeDynamicElements();
    });

})();
