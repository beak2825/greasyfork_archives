// ==UserScript==
// @name         Nedo Auto Contest Participation Script
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Автоматом участвует в розыгрышах после ручного входа в первый розыгрыш.
// @author       eretly
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514988/Nedo%20Auto%20Contest%20Participation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/514988/Nedo%20Auto%20Contest%20Participation%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфиг
    const CHECK_INTERVAL = 100; // 100 ms
    const PARTICIPATION_WAIT = 3000; // ms, ждем 3 секунды, прежде чем проверять скрытое состояние кнопки
    const SCROLL_ATTEMPTS = 2; // Количество попыток прокрутки
    const SCROLL_INTERVAL = 1000; // ms, интервал между попытками прокрутки
    const SCROLL_OFFSET = 150; // px, Выше (0+) / Ниже (-0) прокручивать страницу
    const DOUBLE_CHECK_DELAY = 500; // 400 ms, задержка перед повторной проверкой скролла
    const BEFORE_CLICK_DELAY = 100; // 100 ms, задержка перед нажатием на кнопку
    const AFTER_CLICK_DELAY = 300; // 300 ms, задержка после нажатия на кнопку

    const STORAGE_KEY = 'nedoAutoContestListURL';
    const AUTO_MODE_KEY = 'nedoAutoContestMode';
    const FIRST_ENTRY_KEY = 'nedoFirstContestEntry';
    const SUCCESSFUL_PARTICIPATION_KEY = 'nedoSuccessfulParticipation';

    function saveContestListURL(url) {
        sessionStorage.setItem(STORAGE_KEY, url);
        console.log('Сохранен URL списка розыгрышей с фильтрами:', url);
    }

    function getSavedContestListURL() {
        return sessionStorage.getItem(STORAGE_KEY);
    }

    function getContestListURL() {
        const hostname = window.location.hostname;
        switch (hostname) {
            case 'lolz.live':
                return 'https://lolz.live/forums/contests/';
            case 'lolz.guru':
                return 'https://lolz.guru/forums/contests/';
            case 'zelenka.guru':
                return 'https://zelenka.guru/forums/contests/';
            default:
                console.warn('Неизвестный домен:', hostname);
                return null;
        }
    }

    function setAutoMode(value) {
        sessionStorage.setItem(AUTO_MODE_KEY, value.toString());
        console.log(value ? 'Авто-режим активирован' : 'Авто-режим деактивирован');
    }

    function getAutoMode() {
        return sessionStorage.getItem(AUTO_MODE_KEY) === 'true';
    }

    function setFirstEntry(value) {
        sessionStorage.setItem(FIRST_ENTRY_KEY, value.toString());
    }

    function getFirstEntry() {
        return sessionStorage.getItem(FIRST_ENTRY_KEY) === 'true';
    }

    function setSuccessfulParticipation(value) {
        sessionStorage.setItem(SUCCESSFUL_PARTICIPATION_KEY, value.toString());
    }

    function getSuccessfulParticipation() {
        return sessionStorage.getItem(SUCCESSFUL_PARTICIPATION_KEY) === 'true';
    }

    function updateContestListURL() {
        const contestListURL = getContestListURL();
        if (window.location.href.includes(contestListURL)) {
            saveContestListURL(window.location.href);
            if (isDirectAccess()) {
                resetAllStates();
                console.log('Обнаружен прямой вход на страницу розыгрышей. Все состояния сброшены.');
            }
        }
    }

    function isDirectAccess() {
        return document.referrer === '' || !document.referrer.includes(window.location.hostname);
    }

    function resetAllStates() {
        setFirstEntry(false);
        setAutoMode(false);
        setSuccessfulParticipation(false);
    }

    function cleanUpContestPage() {
        let contestBlock = document.querySelector(".contestThreadBlock");

        if (contestBlock) {
            let contentBlock = document.querySelector(".messageText.SelectQuoteContainer.baseHtml.ugc");
            let pollBlock = document.querySelector(".PollContainer");

            if (contentBlock) contentBlock.remove();
            if (pollBlock) pollBlock.remove();
        }
    }

    async function scrollToElement() {
        const selector = "a.LztContest--Participate";
        const element = await waitForElement(selector);

        if (element) {
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.pageYOffset;
            const middleOfElement = absoluteElementTop + elementRect.height / 2;
            const scrollTo = middleOfElement - (window.innerHeight / 2) - SCROLL_OFFSET;

            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            });
            console.log('Прокручено к элементу:', element);

            setTimeout(() => {
                const newElementRect = element.getBoundingClientRect();
                if (newElementRect.top > SCROLL_OFFSET) {
                    console.log('Элемент не на нужной позиции, корректировка...');
                    window.scrollTo({
                        top: window.pageYOffset + newElementRect.top - SCROLL_OFFSET,
                        behavior: 'smooth'
                    });
                }
            }, DOUBLE_CHECK_DELAY);

            return true;
        } else {
            console.log('Элемент не найден после ожидания');
            return false;
        }
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, CHECK_INTERVAL);
        });
    }
    function clickNextContestLink() {
        const selector = ".discussionListItem a.listBlock.main.PreviewTooltip";
        const links = document.querySelectorAll(selector);
        for (let link of links) {
            if (!link.closest('.discussionListItem').classList.contains('participated')) {
                console.log('Кликаем по следующему розыгрышу:', link.href);
                link.click();
                return true;
            }
        }
        console.log('Не найдено больше розыгрышей для участия.');
        return false;
    }

    function waitForParticipateButton() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const participateButton = document.querySelector('a.LztContest--Participate.button:not([disabled])');
                if (participateButton && participateButton.getAttribute('href').includes('token')) {
                    clearInterval(interval);
                    resolve(participateButton);
                }
            }, CHECK_INTERVAL);
        });
    }

    async function participateInContest() {
        console.log('Ожидание доступности кнопки участия...');
        const participateButton = await waitForParticipateButton();
        console.log('Кнопка участия доступна, ожидаем перед кликом...');

        await new Promise(resolve => setTimeout(resolve, BEFORE_CLICK_DELAY));

        participateButton.click();
        console.log('Кликнули по кнопке участия');

        await new Promise(resolve => setTimeout(resolve, AFTER_CLICK_DELAY));

        console.log('Участие завершено, возвращаемся к списку розыгрышей');
        setSuccessfulParticipation(true);

        const contestListURL = getSavedContestListURL();
        if (contestListURL) {
            window.location.href = contestListURL;
        } else {
            console.warn('Не удалось определить URL списка розыгрышей для возврата.');
        }
    }

    async function init() {
        const currentURL = window.location.href;
        const contestListURL = getContestListURL();

        if (currentURL.includes('/threads/')) {
            console.log('На странице розыгрыша, начинаем процесс участия...');

            const elementFound = await scrollToElement();

            if (elementFound) {
                if (!getFirstEntry()) {
                    setFirstEntry(true);
                    setAutoMode(true);
                    console.log('Первый вход в розыгрыш, активируем авто-режим');
                }

                if (getAutoMode()) {
                    setTimeout(participateInContest, PARTICIPATION_WAIT);
                }
            } else {
                console.log('Элемент для прокрутки не найден, участие не будет выполнено.');
            }
        } else if (currentURL.includes(contestListURL)) {
            console.log('На странице списка розыгрышей, обновляем URL...');
            updateContestListURL();

            if (getAutoMode() && getSuccessfulParticipation()) {
                setSuccessfulParticipation(false);
                setTimeout(() => {
                    if (!clickNextContestLink()) {
                        setAutoMode(false);
                        setFirstEntry(false);
                        console.log('Авто-режим выключен, так как не осталось розыгрышей для участия.');
                    }
                }, 1000);
            }
        } else {
            console.log('На другой странице, скрипт не активирован.');
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, { subtree: true, childList: true });

    init();
})();