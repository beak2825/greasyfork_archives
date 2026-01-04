// ==UserScript==
// @name         2ch-CAPTCHA-MATH
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @version      0.1
// @author       Master2ch
// @description  2ch captcha easy solve
// @homepageURL  https://t.me/Master2ch
// @author       Master2ch
// @match        *://2ch.hk/*
// @namespace    https://greasyfork.org/ru/users/1120123
// @downloadURL https://update.greasyfork.org/scripts/470295/2ch-CAPTCHA-MATH.user.js
// @updateURL https://update.greasyfork.org/scripts/470295/2ch-CAPTCHA-MATH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function solveEquation(equation) {
        const parts = equation.split(/([\+\-\*\/=])/); // Используется регулярное выражение для разделения уравнения по операторам
        const operand1 = parts[0].trim() === "?" ? null : parseInt(parts[0].trim());
        const operator = parts[1].trim();
        const operand2 = parts[2].trim() === "?" ? null : parseInt(parts[2].trim());
        const result = parts[4].trim() === "?" ? null : parseInt(parts[4].trim());

        if (operand1 === null) {
            switch (operator) {
                case "/":
                case "\\":
                    return result * operand2;
                case "*":
                    return result / operand2;
                case "+":
                    return result - operand2;
                case "-":
                    return result + operand2;
            }
        } else if (operand2 === null) {
            switch (operator) {
                case "/":
                case "\\":
                    return operand1 / result;
                case "*":
                    return result / operand1;
                case "+":
                    return result - operand1;
                case "-":
                    return operand1 - result;
            }
        } else if (result === null) {
            switch (operator) {
                case "/":
                case "\\":
                    return operand1 / operand2;
                case "*":
                    return operand1 * operand2;
                case "+":
                    return operand1 + operand2;
                case "-":
                    return operand1 - operand2;
            }
        }
    }

    // Получаем все элементы с классом .captcha__val.input
    var inputElements = document.querySelectorAll('.captcha__val.input');

    // Добавляем обработчик события input к каждому элементу
    inputElements.forEach(function(inputElement) {
        inputElement.maxLength = 20;
        var pattern = /\s*([\d]+|\?)\s*[-+*/\\]\s*([\d]+|\?)\s*=\s*([\d]+|\?)\s/g; // Паттерн для поиска символа '=', числа и пробела с параметром жадности
        inputElement.addEventListener('input', function(event) {
            var enteredText = event.target.value;

            if (pattern.test(enteredText)) {
                console.log('REPLACE !!!!!!!!');
                event.target.value = solveEquation(enteredText);
            }

            return true; // Продолжение дальнейших событий
        });
    });
})();