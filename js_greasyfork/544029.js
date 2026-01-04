// ==UserScript==
// @name         2ch-CAPTCHA-MATH
// @license      MIT
// @version      0.2
// @author       Master2ch
// @description  Автоматическое решение математической CAPTCHA на 2ch.hk
// @homepageURL  https://t.me/Master2ch
// @match        *://2ch.hk/*
// @namespace    https://greasyfork.org/ru/users/1120123
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544029/2ch-CAPTCHA-MATH.user.js
// @updateURL https://update.greasyfork.org/scripts/544029/2ch-CAPTCHA-MATH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Логгер для отладки и вывода сообщений в консоль.
     */
    const logger = {
        info: (message) => {
            console.log(`[2ch-CAPTCHA-MATH] ${message}`);
        },
        warn: (message) => {
            console.warn(`[2ch-CAPTCHA-MATH] ${message}`);
        },
        error: (message, err) => {
            console.error(`[2ch-CAPTCHA-MATH] ${message}`, err);
        }
    };

    /**
     * Решает математическое уравнение, в котором один из операндов или результат неизвестен.
     * @param {string} equation Строка уравнения, например "2 + ? = 5" или "? * 3 = 6".
     * @returns {number|null} Результат уравнения или null, если решить не удалось.
     */
    function solveEquation(equation) {
        // Улучшенное регулярное выражение для более точного парсинга,
        // учитывая возможные пробелы и гарантируя захват оператора и '='
        const match = equation.match(/\s*(\d+|\?)\s*([-+*/\\])\s*(\d+|\?)\s*=\s*(\d+|\?)\s*/);

        if (!match) {
            logger.warn(`Не удалось разобрать уравнение: "${equation}"`);
            return null;
        }

        // Извлекаем части: match[1] - первый операнд, match[2] - оператор,
        // match[3] - второй операнд, match[4] - результат.
        let operand1Str = match[1];
        let operator = match[2];
        let operand2Str = match[3];
        let resultStr = match[4];

        // Преобразуем строки в числа, если это не "?"
        const operand1 = operand1Str === "?" ? null : parseFloat(operand1Str);
        const operand2 = operand2Str === "?" ? null : parseFloat(operand2Str);
        const result = resultStr === "?" ? null : parseFloat(resultStr);

        // Обрабатываем оператор деления, где 2ch может использовать как / так и \
        if (operator === '\\') {
            operator = '/';
        }

        // Логика решения
        if (operand1 === null) {
            switch (operator) {
                case "/": return (operand2 !== 0) ? result * operand2 : null; // Деление на ноль
                case "*": return (operand2 !== 0) ? result / operand2 : null;
                case "+": return result - operand2;
                case "-": return result + operand2;
            }
        } else if (operand2 === null) {
            switch (operator) {
                case "/": return (result !== 0) ? operand1 / result : null; // Деление на ноль
                case "*": return (operand1 !== 0) ? result / operand1 : null;
                case "+": return result - operand1;
                case "-": return operand1 - result;
            }
        } else if (result === null) {
            switch (operator) {
                case "/": return (operand2 !== 0) ? operand1 / operand2 : null; // Деление на ноль
                case "*": return operand1 * operand2;
                case "+": return operand1 + operand2;
                case "-": return operand1 - operand2;
            }
        }
        logger.warn(`Неподдерживаемый сценарий для уравнения: "${equation}"`);
        return null; // Возвращаем null, если ни одно условие не подошло
    }

    /**
     * Обрабатывает изменение значения в поле ввода CAPTCHA.
     * @param {Event} event Событие ввода.
     */
    function handleCaptchaInput(event) {
        const inputElement = event.target;
        const enteredText = inputElement.value;

        // Регулярное выражение для проверки, похоже ли введенное значение на уравнение CAPTCHA.
        // Оно ищет [число или ?] [оператор] [число или ?] = [число или ?]
        const captchaPattern = /^\s*(\d+|\?)\s*[-+*/\\]\s*(\d+|\?)\s*=\s*(\d+|\?)\s*$/;

        if (captchaPattern.test(enteredText)) {
            const solution = solveEquation(enteredText);
            if (solution !== null && !isNaN(solution)) { // Проверяем, что решение не null и является числом
                logger.info(`Найдено уравнение "${enteredText}", решение: ${solution}`);
                inputElement.value = Math.round(solution); // Округляем до целого числа, т.к. CAPTCHA обычно требует целые
                inputElement.dispatchEvent(new Event('change', { bubbles: true })); // Имитируем событие 'change'
                inputElement.dispatchEvent(new Event('input', { bubbles: true })); // Имитируем событие 'input' на всякий случай
            } else {
                logger.warn(`Не удалось решить "${enteredText}" или получен некорректный результат.`);
            }
        }
    }

    // --- Инициализация скрипта ---
    function initialize() {
        // Ищем все элементы CAPTCHA. Используем MutationObserver для динамически загружаемых CAPTCHA.
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        // Проверяем, является ли добавленный узел элементом или содержит нужные элементы
                        if (node.nodeType === 1) { // ELEMENT_NODE
                            const inputElements = node.querySelectorAll('.captcha__val.input');
                            inputElements.forEach(inputElement => {
                                // Добавляем флаг, чтобы не добавлять обработчик несколько раз
                                if (!inputElement.dataset.captchaMathProcessed) {
                                    inputElement.dataset.captchaMathProcessed = 'true';
                                    inputElement.maxLength = 20; // Устанавливаем maxlength
                                    inputElement.addEventListener('input', handleCaptchaInput);
                                    logger.info(`Добавлен обработчик к элементу CAPTCHA: ${inputElement.outerHTML}`);
                                }
                            });
                        }
                    });
                }
            });
        });

        // Начинаем наблюдение за изменениями в теле документа
        observer.observe(document.body, { childList: true, subtree: true });

        // Также сразу ищем существующие элементы CAPTCHA на момент загрузки страницы
        document.querySelectorAll('.captcha__val.input').forEach(inputElement => {
            if (!inputElement.dataset.captchaMathProcessed) {
                inputElement.dataset.captchaMathProcessed = 'true';
                inputElement.maxLength = 20;
                inputElement.addEventListener('input', handleCaptchaInput);
                logger.info(`Добавлен обработчик к существующему элементу CAPTCHA: ${inputElement.outerHTML}`);
            }
        });

        logger.info("2ch-CAPTCHA-MATH скрипт загружен и готов.");
    }

    // Запускаем инициализацию после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();