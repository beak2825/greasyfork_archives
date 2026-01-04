// ==UserScript==
// @name         Ревёрс текста

// @name         Реверс текста

// @namespace    http://tampermonkey.net/

// @version      185.0

// @description  Реверсирование текста без смещения букв

// @match        *://*/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/518621/%D0%A0%D0%B5%D0%B2%D1%91%D1%80%D1%81%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/518621/%D0%A0%D0%B5%D0%B2%D1%91%D1%80%D1%81%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // Функция для реверсирования текста

    function reversedText(text) {

        return text.split('').reverse().join('');

    }

    // Создаем интерфейс для ввода текста

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

    // Кнопка для реверсирования текста

    const reverseBtn = document.createElement('button');

    reverseBtn.textContent = 'Реверсировать';

    reverseBtn.onclick = () => {

        const input = inputField.value;

        if (input) {

            const reversed = reversedText(input);

            navigator.clipboard.writeText(reversed);

            alert(`Реверсированный текст: ${reversed}`);

        }

    };

    inputContainer.appendChild(inputField);

    inputContainer.appendChild(reverseBtn);

    document.body.appendChild(inputContainer);

})();


// @namespace    http://tampermonkey.net/
// @version      2024-11-23
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