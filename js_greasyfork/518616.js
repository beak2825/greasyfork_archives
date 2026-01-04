// ==UserScript==
// @name         Шифратор текста 2.0
// @namespace    http://tampermonkey.net/// ==UserScript==

// @name         Шифровка и расшифровка текста

// @namespace    http://tampermonkey.net/

// @version      821.0

// @description  Шифрование и расшифровка текста с интерфейсом выбора

// @match        *://*/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/518616/%D0%A8%D0%B8%D1%84%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/518616/%D0%A8%D0%B8%D1%84%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%2020.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // Функции для шифровки и расшифровки

    function encrypt(text) {

        return reversedText(shiftText(reversedText(shiftText(text, 5)), -9));

    }

    function decrypt(text) {

        return shiftText(reversedText(shiftText(reversedText(text), 9)), -5);

    }

    function shiftText(text, shift) {

        return text.split('').map(char => {

            let code = char.charCodeAt(0);

            return (code >= 1072 && code <= 1103) ?

                String.fromCharCode((code - 1072 + shift + 32) % 32 + 1072) : char;

        }).join('');

    }

    function reversedText(text) {

        return text.split('').reverse().join('');

    }

    // Новый интерфейс ввода текста

    let inputContainer = document.createElement('div');

    inputContainer.style.position = 'fixed';

    inputContainer.style.bottom = '10px';

    inputContainer.style.right = '10px';

    inputContainer.style.background = '#fff';

    inputContainer.style.border = '1px solid #000';

    inputContainer.style.padding = '10px';

    inputContainer.style.zIndex = 10000;

    // Поле для ввода текста

    let inputField = document.createElement('textarea');

    inputField.maxLength = 10000;

    inputField.rows = 2;

    inputField.cols = 30;

    // Кнопки для шифровки и расшифровки

    const encryptBtn = document.createElement('button');

    encryptBtn.textContent = 'Зашифровать';

    encryptBtn.onclick = () => {

        const input = inputField.value;

        if (input) {

            const encrypted = encrypt(input);

            navigator.clipboard.writeText(encrypted);

            alert(`Зашифрованный текст: ${encrypted}`);

        }

    };

    const decryptBtn = document.createElement('button');

    decryptBtn.textContent = 'Расшифровать';

    decryptBtn.onclick = () => {

        const input = inputField.value;

        if (input) {

            const decrypted = decrypt(input);

            alert(`Расшифрованный текст: ${decrypted}`);

        }

    };

    inputContainer.appendChild(inputField);

    inputContainer.appendChild(encryptBtn);

    inputContainer.appendChild(decryptBtn);

    document.body.appendChild(inputContainer);

})();


// @version      2024-11-16
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