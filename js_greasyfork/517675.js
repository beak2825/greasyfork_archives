// ==UserScript==
// @name         Auto-Apply for Vacancies
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Автоматический отклик на вакансии сайта hh.ru с возможностью включения/выключения через меню Tampermonkey.
// @author       EnterBrain42,nobi-k
// @match        *://*.hh.ru/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517675/Auto-Apply%20for%20Vacancies.user.js
// @updateURL https://update.greasyfork.org/scripts/517675/Auto-Apply%20for%20Vacancies.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Храним ссылки на вакансии, на которые уже отправлен отклик
    let respondedVacancies = new Set();
    let isEnabled = false; // Флаг для включения/выключения скрипта

    // Загружаем количество вакансий из localStorage, если оно там есть
    let vacanciesToProcess = parseInt(localStorage.getItem('vacanciesToProcess'), 10) || 20;

    // Получаем текст сопроводительного письма из локальной памяти, если он там есть
    let coverLetterText = localStorage.getItem('coverLetterText') || `Здравствуйте!

Меня зовут [Имя]. Хочу представить вам свою кандидатуру на данную позицию в вашей компании.

Уверен, что смогу эффективно поддержать вашу команду благодаря своим знаниям и опыту.

Буду рад стать частью вашей команды! С удовольствием расскажу подробнее о своём опыте и отвечу на вопросы.

С уважением,
[Фамилия Имя]
Контактный номер: [Телефон]
Telegram: [Ссылка на телеграмм]`;

    const triggerInputChange = (element, value) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(element, value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    const runTasks = async () => {
        // Проверка, что текущий URL соответствует шаблону для страниц вакансий
        if (!window.location.href.includes('hh.ru/search/vacancy')) {
            console.log('Скрипт не будет работать на этой странице. Ожидаем страницу с вакансиями.');
            return;
        }

        if (!isEnabled) {
            console.log('Скрипт отключен.');
            return;
        }

        const buttons = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');

        if (buttons.length === 0) {
            console.log('Не найдено кнопок для отклика.');
            return;
        }

        let processedCount = 0;

        for (let i = 0; i < buttons.length; i++) {
            if (!isEnabled || processedCount >= vacanciesToProcess) {
                console.log('Достигнут лимит вакансий для обработки или скрипт выключен.');
                break; // Выход из цикла, если обработано заданное количество вакансий
            }

            const button = buttons[i];
            const vacancyLink = button.href; // Получаем ссылку на вакансию

            if (respondedVacancies.has(vacancyLink)) {
                console.log(`Пропускаем вакансию ${vacancyLink}, отклик уже был отправлен.`);
                continue;
            }

            console.log(`Обработка кнопки ${i + 1} из ${buttons.length}`, button);

            let modalOpened = false;

            const modalObserver = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && document.querySelector('[data-qa="vacancy-response-submit-popup"]')) {
                        modalOpened = true;
                        console.log('Модальное окно появилось.');
                        break;
                    }
                }
            });

            modalObserver.observe(document.body, { childList: true, subtree: true });

            button.click();

            await wait(2000);

            const relocationWarningButton = document.querySelector('[data-qa="relocation-warning-confirm"]');
            if (relocationWarningButton) {
                relocationWarningButton.click();
                console.log('Подтвердили отклик на вакансию в другой стране.');
                await wait(1000);
            }

            // Проверка, что текущий URL соответствует шаблону для страниц вакансий(если во время отклика перешли на другую страницу)
            if (!window.location.href.includes('hh.ru/search/vacancy')) {
                console.log('Скрипт не будет работать на этой странице. Ожидаем страницу с вакансиями.');
                return;
            }

            if (modalOpened) {
                modalObserver.disconnect();

                const addLetterButton = document.querySelector('[data-qa="vacancy-response-letter-toggle"]');
                if (addLetterButton && !document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]')) {
                    addLetterButton.click();
                    await wait(500);
                }

                const coverLetterInput = document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]');
                if (coverLetterInput) {
                    triggerInputChange(coverLetterInput, coverLetterText);
                    console.log('Добавлено сопроводительное письмо.');
                }

                const modalSubmitButton = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
                if (modalSubmitButton) {
                    modalSubmitButton.click();
                    console.log('Нажали кнопку "Откликнуться" в модалке');
                } else {
                    console.log('Кнопка "Откликнуться" в модальном окне не найдена');
                }

                await wait(2000);

                respondedVacancies.add(vacancyLink);
                processedCount++;
            } else {
                console.log('Модальное окно не появилось, пропускаем эту вакансию.');
            }

            modalObserver.disconnect();
            await wait(1000);
        }

        const nextPageButton = document.querySelector('[data-qa="pager-next"]');
        if (nextPageButton && processedCount < vacanciesToProcess) {
            console.log('Переход на следующую страницу...');
            nextPageButton.click();
            await wait(4000);
            runTasks();
        } else {
            console.log('Все вакансии обработаны или лимит вакансий достигнут.');
        }
    };

    // Меню Tampermonkey для управления скриптом
    GM_registerMenuCommand('Включить авто-отклик', () => {
        isEnabled = true;
        console.log('Скрипт включен.');
        runTasks();
    });

    GM_registerMenuCommand('Отключить авто-отклик', () => {
        isEnabled = false;
        console.log('Скрипт отключен.');
    });

    // Добавим команду для редактирования текста сопроводительного письма
    GM_registerMenuCommand('Редактировать текст сопроводительного письма', () => {
        const editorWindow = window.open('', '', 'width=600,height=400');
        editorWindow.document.write(`
            <h3>Редактирование текста сопроводительного письма</h3>
            <textarea id="coverLetterEditor" style="width: 100%; height: 80%; padding: 10px;">${coverLetterText}</textarea>
            <br>
            <button id="saveButton">Сохранить</button>
            <button id="cancelButton">Отменить</button>
        `);

        editorWindow.document.getElementById('saveButton').addEventListener('click', () => {
            const newText = editorWindow.document.getElementById('coverLetterEditor').value;
            coverLetterText = newText;
            localStorage.setItem('coverLetterText', coverLetterText);
            console.log('Текст сопроводительного письма обновлён и сохранён.');
            editorWindow.close();
        });

        editorWindow.document.getElementById('cancelButton').addEventListener('click', () => {
            console.log('Редактирование отменено.');
            editorWindow.close();
        });
    });

    // Добавим команду для редактирования количества вакансий
    GM_registerMenuCommand('Редактировать количество вакансий', () => {
        const newCount = prompt("Введите количество вакансий для обработки за раз:", vacanciesToProcess);
        const parsedCount = parseInt(newCount, 10);
        if (!isNaN(parsedCount) && parsedCount > 0) {
            vacanciesToProcess = parsedCount;
            localStorage.setItem('vacanciesToProcess', vacanciesToProcess); // Сохраняем в localStorage
            console.log(`Количество вакансий для обработки изменено на ${vacanciesToProcess}.`);
        } else {
            console.log('Некорректное количество вакансий.');
        }
    });

    console.log('Скрипт загружен. Используйте меню Tampermonkey для управления.');
})();
