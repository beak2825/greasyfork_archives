// ==UserScript==
// @name         Камень ножницы бумага
// @namespace    http://tampermonkey.net/// ==UserScript==
// @name         Игра онлайн с ботом
// @name         Игра скотрит
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Простой интерфейс игры Камень, ножницы, бумага
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518619/%D0%9A%D0%B0%D0%BC%D0%B5%D0%BD%D1%8C%20%D0%BD%D0%BE%D0%B6%D0%BD%D0%B8%D1%86%D1%8B%20%D0%B1%D1%83%D0%BC%D0%B0%D0%B3%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/518619/%D0%9A%D0%B0%D0%BC%D0%B5%D0%BD%D1%8C%20%D0%BD%D0%BE%D0%B6%D0%BD%D0%B8%D1%86%D1%8B%20%D0%B1%D1%83%D0%BC%D0%B0%D0%B3%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Создаем интерфейс для игры
    const gameInterface = document.createElement('div');
    gameInterface.style.position = 'fixed';
    gameInterface.style.bottom = '10px';
    gameInterface.style.right = '10px';
    gameInterface.style.backgroundColor = '#fff';
    gameInterface.style.border = '1px solid #000';
    gameInterface.style.padding = '10px';
    gameInterface.style.zIndex = '9999';

    // Функция для генерации выбора компьютера
    function computerChoice() {
        const choices = ['камень', 'ножницы', 'бумага'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    // Функция для обработки выбора игрока
    function playGame(playerSelection) {
        const compSelection = computerChoice();
        let result = '';

        if (playerSelection === compSelection) {
            result = 'Ничья!';
        } else if ((playerSelection === 'камень' && compSelection === 'ножницы') ||
                   (playerSelection === 'ножницы' && compSelection === 'бумага') ||
                   (playerSelection === 'бумага' && compSelection === 'камень')) {
            result = 'Вы выиграли!';
        } else {
            result = 'Вы проиграли!';
        }
        alert(`Ваш выбор: ${playerSelection}\\nВыбор компьютера: ${compSelection}\\nРезультат: ${result}`);
    }

    // Создаем кнопки для выбора игрока
    ['камень', 'ножницы', 'бумага'].forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.onclick = () => playGame(choice);
        gameInterface.appendChild(button);
    });

    document.body.appendChild(gameInterface);
})();
// @namespace    http://tampermonkey.net/
// @version      2024-10-03
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
// @version      2024-11-03
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