// ==UserScript==
// @name         在庫表の改良
// @namespace    http://tampermonkey.net/
// @version      1.29
// @description  入力中Enterで下に移動。コピペ時の改行に対応。各行をナンバリング。文字数チェック。重複コードチェック。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498800/%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/498800/%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function countByteLength(str) {
        let length = 0;
        for (let char of str) {
            length += (char.match(/[^\x00-\xff]/)) ? 2 : 1;
        }
        return length;
    }

    function highlightInputIfExceedsMaxLength(input, maxLength) {
        if (!input) return;
        const isOverLimit = countByteLength(input.value) > maxLength;

        if (isOverLimit) {
            input.classList.add('error-maxlength');
        } else {
            input.classList.remove('error-maxlength');
        }
    }

    function attachEventListeners(input, maxLength) {
        if (!input) return;
        input.addEventListener('input', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            updateButtonState();
        });
        input.addEventListener('paste', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            updateButtonState();
        });
    }

    function highlightDuplicateCodes() {
        const stockSettingTable = document.getElementById('stockSettingTable');
        if (!stockSettingTable) return;

        const codeInputsFirstColumn = stockSettingTable.querySelectorAll('tr td:nth-child(3) input[type="text"]');
        const valuesFirstColumn = {};
        const duplicatesFirstColumn = new Set();

        const codeInputsSecondColumn = stockSettingTable.querySelectorAll('tr td:nth-child(6) input[type="text"]');
        const valuesSecondColumn = {};
        const duplicatesSecondColumn = new Set();

        codeInputsFirstColumn.forEach(input => input.classList.remove('error-duplicate'));

        codeInputsFirstColumn.forEach(input => {
            const value = input.value.trim();
            if (value) {
                if (valuesFirstColumn[value]) {
                    duplicatesFirstColumn.add(value);
                } else {
                    valuesFirstColumn[value] = true;
                }
            }
        });

        codeInputsFirstColumn.forEach(input => {
            if (duplicatesFirstColumn.has(input.value.trim())) {
                input.classList.add('error-duplicate');
            }
        });

        codeInputsSecondColumn.forEach(input => input.classList.remove('error-duplicate'));

        codeInputsSecondColumn.forEach(input => {
            const value = input.value.trim();
            if (value) {
                if (valuesSecondColumn[value]) {
                    duplicatesSecondColumn.add(value);
                } else {
                    valuesSecondColumn[value] = true;
                }
            }
        });

        codeInputsSecondColumn.forEach(input => {
            if (duplicatesSecondColumn.has(input.value.trim())) {
                input.classList.add('error-duplicate');
            }
        });
    }

    function initHighlighting() {
        const maxLength = 32;
        const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
        const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
        const inputs = document.querySelectorAll('.hontoroku tr td:nth-child(3) input[type="text"], .hontoroku tr td:nth-child(6) input[type="text"]');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                highlightDuplicateCodes();
            });
        });

        attachEventListeners(verticalAxisInput, maxLength);
        attachEventListeners(horizontalAxisInput, maxLength);

        highlightInputIfExceedsMaxLength(verticalAxisInput, maxLength);
        highlightInputIfExceedsMaxLength(horizontalAxisInput, maxLength);

        highlightDuplicateCodes();
    }

    const style = document.createElement('style');
    style.textContent = `
        .error-maxlength {
            border: 2px solid red !important;
        }
        .error-duplicate {
            border: 2px solid #ffa600 !important;
        }
    `;

    document.head.appendChild(style);

    function attachEventListenersForStockSettingTable(input, maxLength, columnType) {
        if (!input) return;

        const performDuplicateCheck = () => {
            if (columnType === 'first') {
                highlightDuplicateCodes();
            } else if (columnType === 'second') {
                highlightDuplicateCodes();
            }
        };

        input.addEventListener('input', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            performDuplicateCheck();
            updateButtonState();
        });

        input.addEventListener('focus', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            performDuplicateCheck();
            updateButtonState();
        });

        input.addEventListener('blur', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            performDuplicateCheck();
            updateButtonState();
        });

        input.addEventListener('change', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            performDuplicateCheck();
            updateButtonState();
        });

        input.addEventListener('paste', () => {
            highlightInputIfExceedsMaxLength(input, maxLength);
            performDuplicateCheck();
            updateButtonState();
        });
    }

    document.addEventListener('DOMContentLoaded', initHighlighting);


    function highlightInputsInStockSettingTable() {
        const rows = document.querySelectorAll('#stockSettingTable table.hontoroku tr');
        const maxLength = 32;

        rows.forEach((row, index) => {
            if (index > 0 && index <= 20) {
                const secondColInput = row.querySelector('td:nth-child(2) input');
                const fifthColInput = row.querySelector('td:nth-child(5) input');

                attachEventListenersForStockSettingTable(secondColInput, maxLength, 'first');
                attachEventListenersForStockSettingTable(fifthColInput, maxLength, 'second');

                highlightInputIfExceedsMaxLength(secondColInput, maxLength);
                highlightInputIfExceedsMaxLength(fifthColInput, maxLength);
            }
        });

    }

    const getByteLength = (str) => {
        let byteLength = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            byteLength += (charCode > 0x7F) ? 2 : 1;
        }
        return byteLength;
    };

    const highlightInput = (input, headerByteLength) => {
        const inputByteLength = getByteLength(input.value);
        const isOverLimit = (headerByteLength + inputByteLength > 19);
        input.style.border = isOverLimit ? '2px solid red' : '';
        return isOverLimit;
    };

    const highlightInputsBasedOnByteLength = (headerByteLength) => {
        const stockSettingTable = document.getElementById('stockSettingTable');
        if (!stockSettingTable) return;

        const rows = stockSettingTable.querySelectorAll('tr');
        let hasRedBorder = false;

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const thirdColInput = cells[1].querySelector('input');
                const sixthColInput = cells[4].querySelector('input');

                if (thirdColInput) {
                    hasRedBorder = highlightInput(thirdColInput, headerByteLength) || hasRedBorder;
                }

                if (sixthColInput) {
                    hasRedBorder = highlightInput(sixthColInput, headerByteLength) || hasRedBorder;
                }
            }
        });

        return hasRedBorder;
    };

    const updateButtonState = () => {
        const verticalAxisInput = document.getElementById('TbMainproduct縦軸項目名');
        const horizontalAxisInput = document.getElementById('TbMainproduct横軸項目名');
        const thirdColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(3) input');
        const sixthColInputs = document.querySelectorAll('#stockSettingTable table.hontoroku tr td:nth-child(6) input');

        const maxLength = 32;
        const headerTextElement = document.querySelector('h2');
        const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
        const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

        let hasRedBorder = false;
        let buttonMessage = '';

        const inputsToCheck1 = [verticalAxisInput, horizontalAxisInput];
        inputsToCheck1.forEach(input => {
            if (input && countByteLength(input.value) > maxLength) {
                hasRedBorder = true;
                buttonMessage = "項目名を全角16(半角32)文字以内にしてください";
            }
        });

        if (!hasRedBorder) {
            const inputsToCheck2 = [...thirdColInputs, ...sixthColInputs];
            inputsToCheck2.forEach(input => {
                if (input && (headerByteLength + getByteLength(input.value) > 19)) {
                    hasRedBorder = true;
                    buttonMessage = "商品コード+SKUを20文字以内にしてください";
                }
            });
        }

        const saveButton = document.getElementById('saveAndSkuStock');
        if (saveButton && saveButton.value !== "送料を選択してください") {
            saveButton.disabled = hasRedBorder;
            saveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
            saveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
        }

        const registeredSaveButton = document.getElementById('registeredSaveAndSkuStock');
        if (registeredSaveButton && registeredSaveButton.value !== "送料を選択してください") {
            registeredSaveButton.disabled = hasRedBorder;
            registeredSaveButton.style.cursor = hasRedBorder ? 'not-allowed' : '';
            registeredSaveButton.value = hasRedBorder ? buttonMessage : '保存してSKU在庫の設定';
        }
    };

    const stockSettingTable = document.getElementById('stockSettingTable');
    if (stockSettingTable) {
        stockSettingTable.addEventListener('focusout', () => {
            setTimeout(() => {
                const headerTextElement = document.querySelector('h2');
                const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
                const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;
                highlightInputsBasedOnByteLength(headerByteLength);
                updateButtonState();
            }, 10);
        });
    }

    const observer = new MutationObserver(() => {
        initHighlighting();
        highlightInputsInStockSettingTable();
        highlightDuplicateCodes();
        const headerTextElement = document.querySelector('h2');
        const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
        const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

        highlightInputsBasedOnByteLength(headerByteLength);
        updateButtonState();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    initHighlighting();
    highlightInputsInStockSettingTable();
    const headerTextElement = document.querySelector('h2');
    const headerTextMatch = headerTextElement ? headerTextElement.textContent.match(/\[(.*?)\]/) : null;
    const headerByteLength = headerTextMatch ? getByteLength(headerTextMatch[1]) : 0;

    highlightInputsBasedOnByteLength(headerByteLength);
    updateButtonState();

    const divs = document.querySelectorAll('div');
    for (const div of divs) {
        if (div.textContent.includes("この商品は在庫表の設定変更ができません")) {
            return;
        }
    }

    const columns = {
        many: {
            inputIndex: 1,
            codeOffset: 1
        },
        few: {
            inputIndex: 4,
            codeOffset: 1
        }
    };

    let startIndex, endIndex;

    const url = window.location.href;

    if (url.includes("/forests/TbMainproducts/mainedit/") || url.includes("/forests/tb_mainproducts/mainedit/")) {
        startIndex = 30;
        endIndex = 51;
    } else if (url.includes("/forests/TbMainproducts/registered_mainedit/") || url.includes("/forests/tb_mainproducts/registered_mainedit/")) {
        startIndex = 51;
        endIndex = 72;
    } else {
        return;
    }

    function getInputs(column) {
        return Array.from(document.querySelectorAll(`table.hontoroku tr td:nth-child(${column.inputIndex}) input[type="text"]:not([readonly])`));
    }

    function handleEnterKey(inputs) {
        return function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const currentIndex = inputs.indexOf(this);
                const nextInput = inputs[currentIndex + 1];
                if (nextInput) {
                    nextInput.focus();
                }
                const event = new Event('change', { bubbles: true });
                inputs[currentIndex].dispatchEvent(event);
            }
        };
    }

    function handlePaste(inputs) {
        return function(e) {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            const lines = pasteData.split('\n').filter(line => line.trim() !== '');
            let currentIndex = inputs.indexOf(this);

            if (lines.length === 0) {
                return;
            }

            if (lines.length > 1) {
                setTimeout(() => {
                    lines.forEach((line, i) => {
                        if (currentIndex + i < inputs.length) {
                            const currentInput = inputs[currentIndex + i];
                            currentInput.value = line;

                            currentInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    });

                    const lastIndex = Math.min(currentIndex + lines.length - 1, inputs.length - 1);
                    inputs[lastIndex].focus();
                }, 0);
            } else {
                const currentInput = inputs[currentIndex];
                const currentText = currentInput.value;
                const selectionStart = currentInput.selectionStart;
                const selectionEnd = currentInput.selectionEnd;

                const newText = currentText.substring(0, selectionStart) + lines[0] + currentText.substring(selectionEnd);
                currentInput.value = newText;

                const newCursorPosition = selectionStart + lines[0].length;
                currentInput.setSelectionRange(newCursorPosition, newCursorPosition);

                currentInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (lines.length === 1 && pasteData.endsWith('\n')) {
                return;
            }
            inputs[Math.min(currentIndex + lines.length - 1, inputs.length - 1)].focus();
        };
    }

    function addEventListenersToInputs(inputs) {
        inputs.forEach(input => {
            input.addEventListener('keydown', handleEnterKey(inputs));
            input.addEventListener('paste', handlePaste(inputs));
        });
    }

    function addRowNumbers(startIndex, endIndex) {
        const tableRows = document.querySelectorAll('table.hontoroku tbody tr');
        tableRows.forEach((row, index) => {
            const th = document.createElement('th');
            th.scope = 'row';
            th.style.textAlign = 'center';
            if (index >= startIndex && index <= endIndex) {
                if (index === startIndex) {
                    th.innerText = '';
                } else if (index <= endIndex - 1) {
                    th.innerText = index - startIndex;
                } else {
                    th.innerText = '';
                }
            } else {
                th.style.display = 'none';
            }
            row.insertAdjacentElement('afterbegin', th);
        });
    }

    function focusFirstInput() {
        const firstInput = document.querySelector('table.hontoroku tr td:nth-child(2) input[type="text"]');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function addEnterKeyListener() {
        const verticalInput = document.getElementById('TbMainproduct縦軸項目名');
        if (verticalInput) {
            verticalInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    focusFirstInput();
                }
            });
        }
    }

    addEnterKeyListener();

    Object.values(columns).forEach(column => {
        const inputs = getInputs(column);
        addEventListenersToInputs(inputs);
    });

    addRowNumbers(startIndex, endIndex);

})();