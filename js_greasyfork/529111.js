// ==UserScript==
// @name         Тесты тренировочные ответы.
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Этот скрипт не достает ответы, а просто ускоряет решения тренировочного теста, где все равно есть ответ, а скрипт просто подстовляет. Не используйте на реальных тестах так как он заруинит вашу попытку.
// @author       Grok
// @match        https://sdo.uust.ru/mod/quiz/attempt.php*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529111/%D0%A2%D0%B5%D1%81%D1%82%D1%8B%20%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529111/%D0%A2%D0%B5%D1%81%D1%82%D1%8B%20%D1%82%D1%80%D0%B5%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%BE%D1%87%D0%BD%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(message, data) {
        console.log(`[Moodle Extractor ${new Date().toLocaleTimeString()}] ${message}`, data || '');
    }

    const sesskey = unsafeWindow.M?.cfg?.sesskey || '';
    if (!sesskey) {
        log('Ошибка: sesskey не найден');
        return;
    }

    // Ключи для localStorage
    const STORAGE_KEY_ANSWERS = 'moodleQuizAnswers';
    const STORAGE_KEY_PROGRESS = 'moodleQuizProgress';

    function extractQuizData() {
        const questions = document.querySelectorAll('.que');
        log(`Найдено вопросов: ${questions.length}`);
        const quizData = [];

        questions.forEach((question, index) => {
            const qId = question.id;
            const qText = question.querySelector('p[dir="ltr"], .qtext, .formulation')?.innerHTML || 'Текст вопроса не найден';

            const inputs = question.querySelectorAll('input[type="text"]');
            const userAnswers = Array.from(inputs).map(input => input.value.trim());

            const feedbackLinks = question.querySelectorAll('.feedbacktrigger');
            const correctAnswers = Array.from(feedbackLinks).map(link => {
                const content = link.getAttribute('data-content');
                const match = content?.match(/Правильный ответ: (.+?)(<br|$)/);
                return match ? match[1].trim() : null;
            }).filter(Boolean);

            const submitButton = question.querySelector('.submit.btn.btn-secondary');
            const submitId = submitButton ? submitButton.id : null;

            const retryButton = question.querySelector('.mod_quiz-redo_question_button.btn.btn-secondary');
            const retryName = retryButton ? retryButton.name : null;

            quizData.push({
                number: index + 1,
                id: qId,
                text: qText,
                userAnswers,
                correctAnswers: correctAnswers.length ? correctAnswers : 'Неизвестно',
                submitId,
                retryName,
                formData: extractFormData(question),
                inputs: Array.from(inputs)
            });
        });

        return quizData;
    }

    function extractFormData(question) {
        const form = question.closest('form') || document.querySelector('form');
        const inputs = question.querySelectorAll('input');
        const formData = new FormData();

        inputs.forEach(input => {
            if (input.name) {
                formData.append(input.name, input.value || 'test');
            }
        });

        const submitButton = question.querySelector('.submit.btn.btn-secondary');
        if (submitButton) {
            formData.append(submitButton.name || 'submit', submitButton.value || '1');
        }
        formData.append('sesskey', sesskey);
        formData.append('attempt', new URLSearchParams(window.location.search).get('attempt'));
        formData.append('cmid', new URLSearchParams(window.location.search).get('cmid'));
        formData.append('page', new URLSearchParams(window.location.search).get('page') || '0');

        return formData;
    }

    async function fetchCorrectAnswer(questionData) {
        if (questionData.correctAnswers !== 'Неизвестно') {
            return questionData.correctAnswers;
        }

        const url = 'https://sdo.uust.ru/mod/quiz/processattempt.php';
        const options = {
            method: 'POST',
            body: questionData.formData,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        try {
            log(`Отправка запроса для вопроса ${questionData.number}:`, { url, data: [...questionData.formData] });
            const response = await fetch(url, options);
            const text = await response.text();
            log(`Ответ сервера для вопроса ${questionData.number} (статус ${response.status}):`, text.slice(0, 1000) + (text.length > 1000 ? '...' : ''));

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const feedback = doc.querySelector(`#${questionData.id} .feedbacktrigger`);
            if (feedback) {
                const content = feedback.getAttribute('data-content');
                const match = content?.match(/Правильный ответ: (.+?)(<br|$)/g);
                if (match) {
                    return match.map(m => m.replace(/Правильный ответ: (.+?)(<br|$)/, '$1').trim());
                }
            }
            return 'Не удалось извлечь';
        } catch (error) {
            log(`Ошибка при запросе для вопроса ${questionData.number}:`, error);
            return 'Ошибка';
        }
    }

    function fillCorrectAnswers(quizData) {
        const savedAnswers = JSON.parse(localStorage.getItem(STORAGE_KEY_ANSWERS) || '{}');
        quizData.forEach(question => {
            if (question.correctAnswers !== 'Неизвестно' && question.correctAnswers !== 'Ошибка' && question.correctAnswers !== 'Не удалось извлечь') {
                const inputs = question.inputs;
                const answers = Array.isArray(question.correctAnswers) ? question.correctAnswers : [question.correctAnswers];

                inputs.forEach((input, index) => {
                    if (index < answers.length) {
                        input.removeAttribute('readonly');
                        input.value = answers[index];
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });

                savedAnswers[question.id] = answers;
                log(`Заполнены правильные ответы для вопроса ${question.number}: ${answers.join(' / ')}`);
            }
        });
        localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(savedAnswers));
    }

    function outputResults(quizData) {
        console.group('Извлеченные данные теста');
        quizData.forEach(q => {
            console.group(`Вопрос ${q.number} (${q.id})`);
            log(`Текст:`, q.text);
            log(`Ответы пользователя:`, q.userAnswers.length ? q.userAnswers.join(' / ') : '-');
            log(`Правильные ответы:`, Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.correctAnswers);
            log(`ID кнопки проверки:`, q.submitId);
            log(`Name кнопки повторной попытки:`, q.retryName);

            const questionElement = document.getElementById(q.id);
            if (questionElement && q.correctAnswers !== 'Неизвестно' && q.correctAnswers !== 'Ошибка' && q.correctAnswers !== 'Не удалось извлечь') {
                const existingAnswerDiv = questionElement.querySelector('.extracted-answer');
                if (!existingAnswerDiv) {
                    const answerDiv = document.createElement('div');
                    answerDiv.className = 'extracted-answer';
                    answerDiv.style.color = 'green';
                    answerDiv.style.fontWeight = 'bold';
                    answerDiv.style.marginTop = '10px';
                    answerDiv.innerHTML = `Правильные ответы: ${Array.isArray(q.correctAnswers) ? q.correctAnswers.join(' / ') : q.correctAnswers}`;
                    questionElement.appendChild(answerDiv);
                }
            }
            console.groupEnd();
        });
        console.groupEnd();
    }

    async function retryOneQuestion(quizData) {
        const progress = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || '[]');
        log('Проверяем наличие кнопок для повторной попытки...');

        for (const question of quizData) {
            if (question.retryName && !progress.includes(question.retryName)) {
                const retryButton = document.querySelector(`input[name="${question.retryName}"]`);
                if (retryButton) {
                    log(`Нажимаем кнопку повторной попытки для вопроса ${question.number} (${question.retryName})`);
                    retryButton.click();
                    progress.push(question.retryName);
                    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    window.location.reload();
                    return true;
                }
            }
        }

        log('Кнопок для повторной попытки больше нет, процесс завершен');
        localStorage.removeItem(STORAGE_KEY_ANSWERS);
        localStorage.removeItem(STORAGE_KEY_PROGRESS);
        return false;
    }

    async function runExtractor() {
        log('Скрипт Moodle Quiz Answer Extractor запущен');

        const quizData = extractQuizData();
        const savedAnswers = JSON.parse(localStorage.getItem(STORAGE_KEY_ANSWERS) || '{}');

        // Загружаем сохранённые ответы, если они есть
        quizData.forEach(question => {
            if (savedAnswers[question.id]) {
                question.correctAnswers = savedAnswers[question.id];
            }
        });

        outputResults(quizData);

        log('Начинаем автоматическое извлечение ответов...');
        for (const question of quizData) {
            if (question.correctAnswers === 'Неизвестно') {
                question.correctAnswers = await fetchCorrectAnswer(question);
            }
        }

        log('Финальные данные после извлечения:');
        outputResults(quizData);

        log('Заполняем правильные ответы в поля ввода...');
        fillCorrectAnswers(quizData);

        await retryOneQuestion(quizData);
    }

    window.addEventListener('load', () => {
        log('Страница загружена, запуск извлечения');
        runExtractor();
    });
})();