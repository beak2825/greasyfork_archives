// ==UserScript==
// @name         Collect and Copy Q&A from Yandex Forms
// @namespace    https://gist.github.com/ve3xone/9f6246b48aa31ff89bb80f7eeeb99ed5
// @version      0.31
// @description  Собирает вопросы и ответы из формы и копирует в буфер обмена
// @author       Vladislav Startsev (aka ve3xone)
// @match        https://forms.yandex.ru/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant        clipboardWrite
// @license      GNU-GPLV3
// @downloadURL https://update.greasyfork.org/scripts/524115/Collect%20and%20Copy%20QA%20from%20Yandex%20Forms.user.js
// @updateURL https://update.greasyfork.org/scripts/524115/Collect%20and%20Copy%20QA%20from%20Yandex%20Forms.meta.js
// ==/UserScript==

// TODO: Если вдруг понадобиться нужно сделать OCR через translate.yandex.ru на картинки вопроса а то было такое что не текст вопроса кидали в вопросе а картинку

(function() {
    'use strict';

    // Создаем функцию для сбора вопросов и ответов
    function collectQA() {
        // Получаем все вопросы
        let questions = document.querySelectorAll('.QuestionMarkup');

        // Создаем массив для хранения текста
        let outputText = [];

        // Проходим по каждому вопросу и извлекаем текст вопроса и ответов
        questions.forEach((question) => {
            // Получаем текст вопроса
            let questionTextElement = question.querySelector('.QuestionLabel-Text ol li, .QuestionLabel-Text p');
            let questionText = questionTextElement ? questionTextElement.innerText.trim() : "Вопрос не найден.";

            // Получаем все ответы из радио-кнопок
            let answerElements = question.querySelectorAll('.g-radio-group .g-control-label__text .OptionContent div');
            let answers = Array.from(answerElements).map(answer => answer.getAttribute('title').trim());

            // Получаем все ответы из чекбоксов
            let checkboxElements = question.querySelectorAll('.CheckboxQuestion-Control .g-control-label__text .OptionContent div');
            let checkboxAnswers = Array.from(checkboxElements).map(answer => answer.getAttribute('title').trim());

            // Добавляем вопрос и ответы в массив
            outputText.push(`Вопрос: ${questionText}`);



            // Если есть ответы из чекбоксов, добавляем их
            if (checkboxAnswers.length > 0) {
                outputText.push("Тут несколько вариантов ответа:");
                checkboxAnswers.forEach((answer, index) => {
                    outputText.push(`${index + 1}. ${answer}`);
                });
            }
            else{
                // Добавляем ответы из радио-кнопок
                outputText.push("Ответы:");
                answers.forEach((answer, index) => {
                    outputText.push(`${index + 1}. ${answer}`);
                });
            }

            outputText.push(''); // Пустая строка для разделения вопросов
        });

        // Копируем текст в буфер обмена
        navigator.clipboard.writeText(outputText.join('\n')).then(() => {
            alert('Текст успешно скопирован в буфер обмена!');
        }).catch(err => {
            console.error('Ошибка при копировании текста в буфер обмена:', err);
        });
    }

    // Добавляем кнопку для запуска функции
    let copyButton = document.createElement('button');
    copyButton.innerText = 'Собрать и скопировать вопросы и ответы';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '75px';
    copyButton.style.right = '10px';
    copyButton.style.zIndex = 1000; // Убедитесь, что кнопка поверх других элементов
    copyButton.style.padding = '10px';
    copyButton.style.backgroundColor = '#4CAF50'; // Зеленый фон
    copyButton.style.color = 'white'; // Белый текст
    copyButton.style.border = 'none'; // Без границ
    copyButton.style.borderRadius = '5px'; // Закругленные углы
    copyButton.style.cursor = 'pointer'; // Указатель при наведении
    document.body.appendChild(copyButton);

    // Обработчик события для кнопки
    copyButton.addEventListener('click', collectQA);
})();