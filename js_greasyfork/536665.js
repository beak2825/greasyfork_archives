// ==UserScript==
// @name        TrovoManaFarmer
// @name:ru     ТровоМанаФарм
// @description    Get trovo mana
// @description:ru Скрипт автоматического сбора маны
// @namespace   Violentmonkey Scripts
// @match          https://trovo.live/*
// @grant       none
// @version     0.1.2
// @license     MIT
// @author      s_mcdk, traceer, xleeuwx
// @icon https://img.trovo.live/imgupload/application/20201230_s16yrlnpjy3x.png
// @downloadURL https://update.greasyfork.org/scripts/536665/TrovoManaFarmer.user.js
// @updateURL https://update.greasyfork.org/scripts/536665/TrovoManaFarmer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Константы для конфигурации
    const DELAYS = {
        INITIAL_CHECK: 30,
        SHORT_DELAY: { min: 15, max: 90 },
        LONG_DELAY: { min: 120, max: 270 },
        ELEMENT_CHECK: 1000,
        PAGE_RELOAD: 15 * 60 * 1000 // 15 минут в миллисекундах
    };

    // Таймер для обновления страницы
    let reloadTimer;

    function setupPageReload() {
        // Очищаем предыдущий таймер, если он был
        if (reloadTimer) {
            clearTimeout(reloadTimer);
        }

        // Устанавливаем новый таймер
        reloadTimer = setTimeout(() => {
            console.log('Reloading page after 15 minutes...');
            window.location.reload();
        }, DELAYS.PAGE_RELOAD);

        console.log('Page will reload in 15 minutes');
    }

    // Основные функции
    function waitForInitialize() {
        if (typeof window !== 'undefined') {
            initialize();
        } else {
            setTimeout(waitForInitialize, DELAYS.INITIAL_CHECK);
        }
    }

    function initialize() {
        console.log('Mana harvester is initialized');
        setupPageReload(); // Инициализируем таймер обновления страницы
        waitForFindButtonElement(0);
    }

    function getRandomDelay(isLongDelay) {
        const range = isLongDelay ? DELAYS.LONG_DELAY : DELAYS.SHORT_DELAY;
        return Math.floor(Math.random() * (range.max - range.min) + range.min) * 1000;
    }

    function waitForFindButtonElement(waitLonger) {
        const delay = getRandomDelay(waitLonger === 1);
        setTimeout(findButtonElement, delay);
    }

    function findBoxElement() {
        const foundBox = document.querySelectorAll("article.gift-box");
        const foundBtn = document.querySelectorAll("button.spell-btn");
        const foundProgress = document.querySelectorAll("div.progress-bg");

        let waitLonger = 0;

        if (foundBox.length > 0) {
            console.log('Found the Cast Spell box, will close it');
            clickElement(foundBtn[0]);
        }

        if (foundProgress.length > 0 && foundProgress[0].style.cssText.includes('transform: scaleX(1)')) {
            waitLonger = 1;
        }

        // Удаляем стили, скрывающие Cast Spell box
        document.querySelectorAll('.giftbox-style').forEach(el => el.remove());

        waitForFindButtonElement(waitLonger);
    }

    function findButtonElement() {
        const foundButton = document.querySelectorAll("button.spell-btn");
        const foundGiftBox = document.querySelectorAll("article.gift-box");

        if (foundButton.length > 0 && foundGiftBox.length !== 1) {
            console.log('Found the damn button, now click it');

            if (foundButton[0]) {
                clickElement(foundButton[0]);

                // Добавляем стиль для скрытия Cast Spell box
                const style = document.createElement('style');
                style.type = 'text/css';
                style.classList.add("giftbox-style");
                style.textContent = '.gift-box { display: none !important; }';
                (document.head || document.getElementsByTagName('head')[0]).appendChild(style);
            }

            setTimeout(findBoxElement, DELAYS.ELEMENT_CHECK);
        } else {
            waitForFindButtonElement(0);
        }
    }

    function clickElement(element) {
        if (!element) {
            console.log('Element is undefined or null');
            return;
        }

        try {
            element.click();
            console.log('Button clicked successfully');
        } catch (e) {
            console.error('Cannot click the button, something went wrong:', e);
        }
    }

    // Запуск
    setTimeout(waitForInitialize, DELAYS.INITIAL_CHECK);
})();