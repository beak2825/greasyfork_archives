// ==UserScript==// ==UserScript==
// @name         Русский шифратор 2905 года обновлённый 2.0
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Шифратор на русском языке
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523369/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%D1%88%D0%B8%D1%84%D1%80%D0%B0%D1%82%D0%BE%D1%80%202905%20%D0%B3%D0%BE%D0%B4%D0%B0%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D1%91%D0%BD%D0%BD%D1%8B%D0%B9%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/523369/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%D1%88%D0%B8%D1%84%D1%80%D0%B0%D1%82%D0%BE%D1%80%202905%20%D0%B3%D0%BE%D0%B4%D0%B0%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D1%91%D0%BD%D0%BD%D1%8B%D0%B9%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для смещения букв
    function shiftChar(char, shift) {
        const unicode = char.charCodeAt(0);
        if (unicode >= 1072 && unicode <= 1103) { // Проверка на буквы русского алфавита
            return String.fromCharCode(((unicode - 1072 + shift + 32) % 32) + 1072);
        }
        return char; // Возвращаем символ без изменений, если не русский
    }

    // Функция для шифрования
    function encrypt(text) {
        const words = text.split(' ').map(word => {
            let shifted = '';
            for (const char of word) {
                shifted += shiftChar(char, 5); // Смещение +5
            }
            shifted = shifted.split('').reverse().join('');
            return shifted;
        });
        return words.join(' ');
    }

    // Функция для дешифрования
    function decrypt(text) {
        const words = text.split(' ').map(word => {
            let shifted = '';
            for (const char of word) {
                shifted += shiftChar(char, -5); // Смещение -5
            }
            shifted = shifted.split('').reverse().join('');
            return shifted;
        });
        return words.join(' ');
    }

    // Создаем простой интерфейс
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '290px';
    container.style.right = '10px';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid black';
    container.style.zIndex = '1000';
    container.style.padding = '20px';

    const textArea = document.createElement('textarea');
    textArea.placeholder = "Введите текст для шифрования...";
    textArea.style.width = '240px';
    textArea.style.height = '200px';
    container.appendChild(textArea);

    const encryptButton = document.createElement('button');
    encryptButton.innerText = 'Зашифровать';
    encryptButton.onclick = function() {
        const result = encrypt(textArea.value);
        resultArea.value = result; // Отображаем результат в результат-области
        navigator.clipboard.writeText(result).then(() => {
            alert('Зашифрованный текст скопирован в буфер обмена!');
        });
    };
    container.appendChild(encryptButton);

    const decryptButton = document.createElement('button');
    decryptButton.innerText = 'Расшифровать';
    decryptButton.onclick = function() {
        const result = decrypt(textArea.value);
        resultArea.value = result; // Отображаем результат в результат-области
        navigator.clipboard.writeText(result).then(() => {
            alert('Расшифрованный текст скопирован в буфер обмена!');
        });
    };
    container.appendChild(decryptButton);

    const resultArea = document.createElement('textarea');
    resultArea.placeholder = "Результат шифрования...";
    resultArea.style.width = '240px';
    resultArea.style.height = '200px';
    resultArea.readOnly = true;
    container.appendChild(resultArea);

    document.body.appendChild(container);
})();
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
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