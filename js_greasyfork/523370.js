// ==UserScript==// ==UserScript==
// @name         Игра: Угадай число с улучшениями хард
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Игра с угадыванием чисел с подсказками, сложностью и скрытыми подсказками
// @author       Вы
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523370/%D0%98%D0%B3%D1%80%D0%B0%3A%20%D0%A3%D0%B3%D0%B0%D0%B4%D0%B0%D0%B9%20%D1%87%D0%B8%D1%81%D0%BB%D0%BE%20%D1%81%20%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8%20%D1%85%D0%B0%D1%80%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/523370/%D0%98%D0%B3%D1%80%D0%B0%3A%20%D0%A3%D0%B3%D0%B0%D0%B4%D0%B0%D0%B9%20%D1%87%D0%B8%D1%81%D0%BB%D0%BE%20%D1%81%20%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8%20%D1%85%D0%B0%D1%80%D0%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetNumbers = [];
    let attempts = 0;
    const maxAttempts = 20; // Максимальное количество попыток
    let digits = 3; // Количество цифр для угадывания
    const totalNumbers = 10; // Максимальное количество генерируемых чисел

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)'; // Центрируем контейнер
    container.style.backgroundColor = 'green'; // Зеленый фон
    container.style.color = 'white'; // Белый текст
    container.style.border = '1px solid black';
    container.style.zIndex = '1000';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    const infoText = document.createElement('div');
    infoText.innerHTML = `<strong>Угадайте ${digits}-значное число (от 0 до 9)</strong><br/>`;

    const levelSelect = document.createElement('select');
    const levels = [3, 4, 5, 6, 7, 8, 9, 10]; // Уровни сложности (3-10 значные)
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.text = `${level}-значное число`;
        levelSelect.appendChild(option);
    });

    levelSelect.onchange = function() {
        digits = parseInt(levelSelect.value);
        targetNumbers = generateRandomNumbers();
        infoText.innerHTML = `<strong>Угадайте ${digits}-значное число (от 0 до 9)</strong><br/>`;
        resultDiv.innerText = '';
        hintDiv.innerText = '';
        hiddenHints = generateHiddenHints(targetNumbers.length);
    };

    const input = document.createElement('input');
    input.placeholder = `Введите ${digits} чисел, разделенных запятой`;

    const guessButton = document.createElement('button');
    guessButton.innerText = 'Угадать';

    const resultDiv = document.createElement('div');
    resultDiv.style.marginTop = '10px';

    const hintDiv = document.createElement('div'); // Для подсказок
    hintDiv.style.marginTop = '10px';
    hintDiv.style.color = 'blue'; // Цвет для подсказок

    container.appendChild(infoText);
    container.appendChild(levelSelect);
    container.appendChild(input);
    container.appendChild(guessButton);
    container.appendChild(resultDiv);
    container.appendChild(hintDiv); // Добавляем hintDiv в контейнер
    document.body.appendChild(container);

    let hiddenHints = generateHiddenHints();

    // Генерация целевых чисел
    function generateRandomNumbers() {
        const numbers = [];
        while (numbers.length < digits) {
            const randNum = Math.floor(Math.random() * totalNumbers);
            if (!numbers.includes(randNum)) {
                numbers.push(randNum);
            }
        }
        return numbers;
    }

    // Генерация скрытых подсказок
    function generateHiddenHints() {
        const hiddenCount = Math.floor(digits * 0.4); // 40% чисел скрыты
        const hiddenIndices = new Set();
        while (hiddenIndices.size < hiddenCount) {
            hiddenIndices.add(Math.floor(Math.random() * digits));
        }
        return hiddenIndices;
    }

    guessButton.onclick = function() {
        const userInputs = input.value.split(',').map(num => parseInt(num.trim()));

        if (userInputs.length !== digits || userInputs.some(num => isNaN(num) || num < 0 || num >= totalNumbers)) {
            resultDiv.innerText = 'Пожалуйста, введите ' + digits + ' чисел от 0 до 9.';
            hintDiv.innerText = ''; // Сбрасываем подсказки при неверном вводе
            return;
        }

        attempts++;
        const feedback = getFeedback(targetNumbers, userInputs);

        if (feedback.correct) {
            resultDiv.innerText = `Поздравляем! Вы угадали числа: ${targetNumbers.join(', ')} за ${attempts} попыток.`;
            guessButton.disabled = true;
        } else {
            resultDiv.innerText = feedback.message;
            hintDiv.innerText = feedback.hint; // Указываем подсказку
            hiddenHints = generateHiddenHints(); // Пересчитываем скрытые подсказки
            if (attempts >= maxAttempts) {
                resultDiv.innerText += `\nИгра окончена. Загаданные числа были: ${targetNumbers.join(', ')}.`;
                guessButton.disabled = true;
            }
        }
    };

    function getFeedback(target, guess) {
        const correctPositions = target.map((num, index) => num === guess[index]);
        const correctCount = correctPositions.filter(Boolean).length;

        if (correctCount === digits) {
            return { correct: true };
        }

        let message = `Правильные цифры: ${correctCount}. `;
        let hint = '';

        for (let i = 0; i < digits; i++) {
            if (!correctPositions[i] && !hiddenHints.has(i)) {
                const diff = Math.abs(target[i] - guess[i]);

                if (diff < 5) {
                    hint += `Для числа ${guess[i]}: "Ну так близко!" (разница ${diff}) `;
                } else if (target[i] < guess[i]) {
                    hint += `Для числа ${guess[i]}: "Многовато!" (больше на ${diff}) `;
                } else {
                    hint += `Для числа ${guess[i]}: "Маловато!" (меньше на ${diff}) `;
                }
            }
        }
        return { correct: false, message: message, hint: hint };
    }

    targetNumbers = generateRandomNumbers(); // Генерация чисел при первой загрузке
})();
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-07
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