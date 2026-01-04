// ==UserScript==
// @name         Moodle Quiz Auto-Answer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Автоматизация теста Moodle с отправкой тестовых ответов и повторными попытками
// @author       You
// @match        https://sdo.uust.ru/mod/quiz/attempt.php?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529103/Moodle%20Quiz%20Auto-Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/529103/Moodle%20Quiz%20Auto-Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для получения текущего этапа из localStorage
    function getStage() {
        return localStorage.getItem('quizAutoStage') || 'initial';
    }

    // Функция для установки текущего этапа в localStorage
    function setStage(stage) {
        localStorage.setItem('quizAutoStage', stage);
    }

    // Функция для очистки этапа (опционально, для сброса)
    function clearStage() {
        localStorage.removeItem('quizAutoStage');
    }

    // Функция задержки (в миллисекундах)
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Проверка, что мы на странице теста
    if (!document.querySelector('body#page-mod-quiz-attempt')) {
        console.log('Скрипт работает только на странице теста Moodle');
        return;
    }

    // Основная логика с этапами
    (async function main() {
        const currentStage = getStage();
        console.log(`Текущий этап: ${currentStage}`);

        switch (currentStage) {
            // Этап 1: Отправка тестовых ответов для вопросов без всплывающих подсказок
            case 'initial':
                console.log('Этап 1: Отправка тестовых ответов');
                await stage1SendTestAnswers();
                break;

            // Этап 2: Проверка наличия кнопок "Повторно ответить на вопрос" и обновление страницы
            case 'checkRetryButtons':
                console.log('Этап 2: Проверка кнопок "Повторно ответить на вопрос"');
                await stage2CheckRetryButtons();
                break;

            // Этап 3: Нажатие на кнопки "Повторно ответить на вопрос" с обновлением страницы
            case 'clickRetryButtons':
                console.log('Этап 3: Нажатие на кнопки "Повторно ответить на вопрос"');
                await stage3ClickRetryButtons();
                break;

            // Этап 4: Вставка ответов и нажатие "Проверить" с обновлением страницы
            case 'insertAnswers':
                console.log('Этап 4: Вставка ответов и проверка');
                await stage4InsertAnswers();
                break;

            default:
                console.log('Неизвестный этап, сброс на начальный');
                setStage('initial');
                window.location.reload();
        }
    })();

    // Этап 1: Отправка тестовых ответов для вопросов без всплывающих подсказок
    async function stage1SendTestAnswers() {
        const questions = document.querySelectorAll('.que');
        let submitted = false;

        for (const question of questions) {
            // Проверяем, есть ли всплывающая подсказка (означает, что ответ уже получен)
            const hasFeedback = question.querySelector('.feedback');
            if (hasFeedback && hasFeedback.style.display !== 'none') {
                console.log(`Вопрос ${question.id} уже имеет ответ, пропускаем`);
                continue;
            }

            // Находим форму ввода (например, радио-кнопки или текстовое поле)
            const radioInputs = question.querySelectorAll('input[type="radio"]');
            const textInputs = question.querySelectorAll('input[type="text"], textarea');

            if (radioInputs.length > 0) {
                // Выбираем первый вариант для радио-кнопок
                radioInputs[0].checked = true;
                console.log(`Выбран тестовый ответ для ${question.id}`);
            } else if (textInputs.length > 0) {
                // Вставляем тестовый текст
                textInputs[0].value = 'Тестовый ответ';
                console.log(`Вставлен тестовый текст для ${question.id}`);
            }

            // Находим кнопку "Проверить" и отправляем ответ
            const checkButton = question.querySelector('input[type="submit"][value="Проверить"]');
            if (checkButton) {
                checkButton.click();
                submitted = true;
                await delay(1000); // Ждем отправки
            }
        }

        if (submitted) {
            setStage('checkRetryButtons');
            console.log('Тестовые ответы отправлены, обновляем страницу');
            window.location.reload();
        } else {
            console.log('Все вопросы уже имеют ответы, переходим к следующему этапу');
            setStage('checkRetryButtons');
            window.location.reload();
        }
    }

    // Этап 2: Проверка наличия кнопок "Повторно ответить на вопрос"
    async function stage2CheckRetryButtons() {
        const retryButtons = document.querySelectorAll('input[type="submit"][value="Повторно ответить на вопрос"]');
        if (retryButtons.length === 0) {
            console.log('Кнопок "Повторно ответить на вопрос" не найдено, переходим к вставке ответов');
            setStage('insertAnswers');
            window.location.reload();
        } else {
            console.log(`Найдено ${retryButtons.length} кнопок "Повторно ответить на вопрос", переходим к их нажатию`);
            setStage('clickRetryButtons');
            window.location.reload();
        }
    }

    // Этап 3: Нажатие на кнопки "Повторно ответить на вопрос" с обновлением страницы
    async function stage3ClickRetryButtons() {
        const retryButtons = document.querySelectorAll('input[type="submit"][value="Повторно ответить на вопрос"]');
        if (retryButtons.length > 0) {
            // Нажимаем на первую кнопку
            const firstRetryButton = retryButtons[0];
            console.log(`Нажимаем "Повторно ответить" для вопроса ${firstRetryButton.closest('.que').id}`);
            firstRetryButton.click();
            await delay(1000); // Ждем отправки
            console.log('Обновляем страницу после нажатия');
            window.location.reload();
        } else {
            console.log('Все кнопки "Повторно ответить" обработаны, переходим к вставке ответов');
            setStage('insertAnswers');
            window.location.reload();
        }
    }

    // Этап 4: Вставка ответов и нажатие "Проверить" с обновлением страницы
    async function stage4InsertAnswers() {
        const questions = document.querySelectorAll('.que');
        let actionTaken = false;

        for (const question of questions) {
            // Проверяем, есть ли кнопка "Проверить" (значит, ответ еще не проверен)
            const checkButton = question.querySelector('input[type="submit"][value="Проверить"]');
            if (!checkButton) {
                console.log(`Вопрос ${question.id} уже проверен, пропускаем`);
                continue;
            }

            // Извлекаем правильный ответ из всплывающей подсказки (предполагаем, что он там есть)
            const feedback = question.querySelector('.feedback');
            let correctAnswer = '';
            if (feedback) {
                // Здесь нужно адаптировать логику под структуру подсказок в вашем Moodle
                // Пример: извлекаем текст из первого абзаца в feedback
                const feedbackText = feedback.querySelector('p');
                if (feedbackText) {
                    correctAnswer = feedbackText.textContent.trim();
                    console.log(`Найден правильный ответ для ${question.id}: ${correctAnswer}`);
                }
            }

            // Вставляем ответ
            const radioInputs = question.querySelectorAll('input[type="radio"]');
            const textInputs = question.querySelectorAll('input[type="text"], textarea');

            if (radioInputs.length > 0) {
                for (const radio of radioInputs) {
                    const label = radio.nextElementSibling;
                    if (label && label.textContent.includes(correctAnswer)) {
                        radio.checked = true;
                        console.log(`Выбран правильный ответ для ${question.id}`);
                        break;
                    }
                }
            } else if (textInputs.length > 0) {
                textInputs[0].value = correctAnswer || 'Тестовый ответ';
                console.log(`Вставлен ответ для ${question.id}`);
            }

            // Нажимаем "Проверить"
            checkButton.click();
            actionTaken = true;
            await delay(1000); // Ждем отправки
            console.log(`Проверен вопрос ${question.id}, обновляем страницу`);
            window.location.reload();
            break; // Обрабатываем по одному вопросу за раз
        }

        if (!actionTaken) {
            console.log('Все вопросы проверены, остаемся на странице теста');
            // Не переходим на финальную страницу, просто завершаем
        }
    }
})();