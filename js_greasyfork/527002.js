// ==UserScript==
// @name         DETIOBR03 autologin
// @namespace    https://xn--h1addnar4cwb.xn--p1ai/
// @version      1.1
// @description  autologin on https://deti.obr03.ru/
// @author       ESOSH makerBot
// @match        https://deti.obr03.ru/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527002/DETIOBR03%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/527002/DETIOBR03%20autologin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Флаг для отслеживания состояния кнопки "Загрузить"
    let isLoadButtonClicked = false;

    // Функция для проверки существования элемента
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Функция для выполнения клика по элементу
    function clickElement(selector, message) {
        const element = document.querySelector(selector);
        if (element && !element.disabled) {
            console.log(message);
            try {
                element.click(); // Используем .click() вместо MouseEvent
                console.log(`Клик по элементу "${selector}" выполнен успешно.`);
                return true;
            } catch (error) {
                console.error(`Не удалось выполнить клик по элементу "${selector}":`, error);
                return false;
            }
        }
        console.error(`Элемент с селектором "${selector}" не найден или отключен.`);
        return false;
    }

    // Функция для обработки модального окна
    function handleModal() {
        const modalSelector = 'body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div > ns-modal > div';
        const closeButtonSelector = 'body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div > ns-modal > div > div.modal-header > div > div.bootstrap-dialog-close-button > button';
        if (elementExists(modalSelector)) {
            if (clickElement(closeButtonSelector, 'Модальное окно обнаружено и закрыто.')) {
                console.log('Кнопка закрытия модального окна нажата.');
            }
        }
    }

    // Функция для обработки страницы выбора роли
    function processRolePage() {
        const buttonSelector = '#view > div > div.block-inline > button > span.glyphicon.glyphicon-new-window';
        if (elementExists(buttonSelector)) {
            clickElement(buttonSelector, 'Кнопка с селектором найдена и нажата.');
        }
    }

    // Функция для обработки страницы расписания
    function processSchedulePage() {
        const menuSelector = 'body > app-component > div.header.ng-scope > div.navbar.navbar-default.navbar-wrapper.ng-scope > app-menu > nav > ul > li:nth-child(5) > ul > li:nth-child(1) > a';
        if (elementExists(menuSelector)) {
            clickElement(menuSelector, 'Пункт меню на странице расписания выбран.');
        } else {
            console.error('Пункт меню на странице расписания не найден.');
        }
    }

    // Функция для обработки страницы журнала
    function processJournalPage() {
        const loadButtonSelector = '#load-journal-btn';

        // Проверяем, была ли кнопка уже нажата
        if (!isLoadButtonClicked) {
            // Добавляем задержку перед кликом, чтобы дождаться полной инициализации кнопки
            setTimeout(() => {
                if (clickElement(loadButtonSelector, "Кнопка 'Загрузить' в журнале нажата.")) {
                    console.log("Автоклик по кнопке 'Загрузить' выполнен.");
                    isLoadButtonClicked = true; // Устанавливаем флаг после успешного клика
                } else {
                    console.error("Кнопка 'Загрузить' не найдена или отключена.");
                }
            }, 2000); // Задержка 2 секунды
        }
    }

    // Основная функция для обработки страницы
    function processPage() {
        const currentUrl = window.location.href;

        if (currentUrl.startsWith('https://deti.obr03.ru/app/simple/attention/choose-session-role/')) {
            processRolePage();
        } else if (currentUrl.startsWith('https://deti.obr03.ru/angular/school/schedule/day/')) {
            processSchedulePage();
        } else if (currentUrl.startsWith('https://deti.obr03.ru/app/school/journal/')) {
            processJournalPage();
        }

        // Проверяем, есть ли модальное окно
        handleModal();
    }

    // Функция для ожидания полной загрузки страницы
    function waitForPageLoad() {
        const checkInterval = 500; // Интервал проверки в миллисекундах
        const maxAttempts = 20; // Максимальное количество попыток
        let attempts = 0;

        const intervalId = setInterval(() => {
            attempts++;
            if (document.readyState === 'complete') {
                clearInterval(intervalId);
                console.log('Страница полностью загружена.');
                processPage();
            } else if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('Превышено время ожидания загрузки страницы.');
            }
        }, checkInterval);
    }

    // Запускаем скрипт после загрузки страницы
    waitForPageLoad();

    // Наблюдатель за изменениями DOM для обработки динамически появляющихся элементов
    const observer = new MutationObserver(() => {
        processPage();
        handleModal();
    });

    // Начинаем наблюдение за всем документом
    observer.observe(document.body, { childList: true, subtree: true });

    // Дополнительный интервал для проверки модального окна (на случай, если MutationObserver пропустит изменения)
    setInterval(handleModal, 1000); // Проверка каждую секунду
})();