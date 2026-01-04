// ==UserScript==
// @name         DETIOBR03 session support
// @namespace    https://xn--h1addnar4cwb.xn--p1ai/
// @version      1.1
// @description  session support on https://deti.obr03.ru/
// @author       ESOSH makerBot
// @match        https://deti.obr03.ru/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527004/DETIOBR03%20session%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/527004/DETIOBR03%20session%20support.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для проверки существования элемента
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Функция для выполнения клика по элементу
    function clickElement(selector, message) {
        const element = document.querySelector(selector);
        if (element && !element.disabled) {
            try {
                element.click(); // Используем .click() для имитации клика
                console.log(message);
                return true;
            } catch (error) {
                console.error(`Не удалось выполнить клик по элементу "${selector}":`, error);
                return false;
            }
        }
        console.error(`Элемент с селектором "${selector}" не найден или отключен.`);
        return false;
    }

    // Функция для нажатия на кнопку "Загрузить"
    function clickLoadButton() {
        return clickElement('#load-journal-btn', "Кнопка 'Загрузить' нажата");
    }

    // Функция для нажатия на кнопку "Сохранить быстрое редактирование"
    function clickQuickEditSaveButton() {
        return clickElement('#quick-edit-save-btn', "Кнопка 'Сохранить быстрое редактирование' нажата");
    }

    // Функция для нажатия на кнопку "Переключить режим быстрого редактирования"
    function clickQuickEditSwitchButton() {
        return clickElement('#quick-edit-switch-btn', "Кнопка 'Переключить режим быстрого редактирования' нажата");
    }

    // Функция для закрытия модального окна
    function closeModalWindow() {
        return clickElement(
            'body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div > div > div.modal-header > div > div.bootstrap-dialog-close-button > button',
            "Модальное окно закрыто"
        );
    }

    // Функция для нажатия на кнопку "Сохранить" на странице редактирования
    function clickSaveButton() {
        const saveButtonSelector = '#view > div > div:nth-child(1) > div > div > div.buttons-panel-left > button.btn.btn-primary';
        if (clickElement(saveButtonSelector, "Кнопка 'Сохранить' нажата")) {
            // Создаем интервал для проверки наличия модального окна
            const checkModalInterval = setInterval(() => {
                if (elementExists('body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div')) {
                    closeModalWindow();
                    clearInterval(checkModalInterval); // Останавливаем интервал после закрытия окна
                }
            }, 100);
        }
    }

    // Функция для установки MutationObserver для отслеживания изменений в DOM
    function setupMutationObserver() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const loadingModal = document.querySelector('body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div');
                    if (loadingModal) {
                        // Ждем, пока модальное окно исчезнет
                        const intervalId = setInterval(() => {
                            if (!document.querySelector('body > div.modal.fade.ng-scope.ng-isolate-scope.in > div > div')) {
                                clearInterval(intervalId); // Останавливаем интервал после исчезновения окна
                                clickLoadButton(); // Пытаемся нажать кнопку "Загрузить"
                            }
                        }, 100);
                    }
                }
            }
        });

        // Начинаем наблюдение за изменениями в DOM
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Основная функция для выполнения всех действий
    function performActions() {
        if (window.location.href.startsWith('https://deti.obr03.ru/app/school/journal/edit')) {
            clickSaveButton();
        } else {
            if (!clickLoadButton()) {
                if (!clickQuickEditSaveButton()) {
                    clickQuickEditSwitchButton();
                }
            }
        }
    }

    // Интервал между нажатиями в миллисекундах (например, каждые 15 минут = 900000 миллисекунд)
    const interval = 800000;

    // Переменная для хранения ID интервала
    let intervalId;

    // Установка MutationObserver для отслеживания изменений в DOM
    setupMutationObserver();

    // Запускаем первый вызов сразу
    intervalId = setInterval(performActions, interval);
})();