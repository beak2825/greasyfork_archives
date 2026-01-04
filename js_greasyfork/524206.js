// ==UserScript==
// @name         Блокнот с возможностью редактирования
// @namespace    http://tampermonkey.net/
// @version      590.9
// @name         Редактирование текста и его ревёрс
// @namespace    http://tampermonkey.net/
// @description  Реверсирование текста
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524206/%D0%91%D0%BB%D0%BE%D0%BA%D0%BD%D0%BE%D1%82%20%D1%81%20%D0%B2%D0%BE%D0%B7%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%D1%8E%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/524206/%D0%91%D0%BB%D0%BE%D0%BA%D0%BD%D0%BE%D1%82%20%D1%81%20%D0%B2%D0%BE%D0%B7%D0%BC%D0%BE%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C%D1%8E%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let historyStack = [];

    function reversedText(text) {
        return text.split('').reverse().join('');
    }

    let inputContainer = document.createElement('div');
    inputContainer.style.position = 'fixed';
    inputContainer.style.bottom = '10px';
    inputContainer.style.right = '10px';
    inputContainer.style.background = 'rgba(255, 255, 255, 0.8)';
    inputContainer.style.border = '1px solid #000';
    inputContainer.style.padding = '10px';
    inputContainer.style.zIndex = 1000000;
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.gap = '5px';
    inputContainer.style.transform = 'translateX(0)'; // Начальное состояние

    let inputField = document.createElement('textarea');
    inputField.maxLength = 1000000;
    inputField.rows = 2;
    inputField.cols = 30;

    let charCountDisplay = document.createElement('div');
    charCountDisplay.textContent = 'Количество символов: 0';

    inputField.addEventListener('input', () => {
        charCountDisplay.textContent = `Количество символов: ${inputField.value.length}`;
    });

    const reverseBtn = document.createElement('button');
    reverseBtn.textContent = 'Реверсировать';
    reverseBtn.onclick = () => {
        const input = inputField.value;
        if (input) {
            const reversed = reversedText(input);
            historyStack.push(input);
            inputField.value = reversed;
            navigator.clipboard.writeText(reversed);
            alert(`Реверсированный текст: ${reversed}`);
        }
    };

    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Отменить';
    undoBtn.onclick = () => {
        if (historyStack.length > 0) {
            const lastState = historyStack.pop();
            inputField.value = lastState;
            charCountDisplay.textContent = `Количество символов: ${lastState.length}`;
        } else {
            alert('Нет ничего для отмены!');
        }
    };

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Выделить всё';
    selectAllBtn.onclick = () => {
        inputField.select();
    };

    const clearAllBtn = document.createElement('button');
    clearAllBtn.textContent = 'Удалить всё';
    clearAllBtn.onclick = () => {
        inputField.value = '';
        charCountDisplay.textContent = 'Количество символов: 0';
        historyStack = [];
    };

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Скрыть интерфейс';
    toggleBtn.onclick = () => {
        const isHidden = inputContainer.style.transform === 'translateX(100%)';
        inputContainer.style.transform = isHidden ? 'translateX(0)' : 'translateX(100%)';
        toggleBtn.textContent = isHidden ? 'Скрыть интерфейс' : 'Показать интерфейс';
        toggleBtn.style.opacity = isHidden ? '1' : '0.5';
    };

    const showBtn = document.createElement('button');
    showBtn.textContent = 'Показать интерфейс';
    showBtn.style.position = 'fixed';
    showBtn.style.bottom = '10px';
    showBtn.style.right = '10px';
    showBtn.style.zIndex = 100001;
    showBtn.onclick = () => {
        inputContainer.style.transform = 'translateX(0)';
        toggleBtn.textContent = 'Скрыть интерфейс';
        toggleBtn.style.opacity = '1';
    };

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(charCountDisplay);
    inputContainer.appendChild(reverseBtn);
    inputContainer.appendChild(undoBtn);
    inputContainer.appendChild(selectAllBtn);
    inputContainer.appendChild(clearAllBtn);
    inputContainer.appendChild(toggleBtn);
    document.body.appendChild(inputContainer);
    document.body.appendChild(showBtn);
})();
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();