// ==UserScript==
// @name         Kinopoisk: Автоклик кнопок с выбором сценария
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически прожимает кнопку "смотреть заставку/пропустить", в зависимости от выбранного сценария
// @match        https://hd.kinopoisk.ru/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544857/Kinopoisk%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BE%D0%BA%20%D1%81%20%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%D0%BE%D0%BC%20%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544857/Kinopoisk%3A%20%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BE%D0%BA%20%D1%81%20%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%D0%BE%D0%BC%20%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Сценарии и соответствующие тексты кнопок для клика
    const SCENARIOS = {
        showTrailerAndCredits: ['смотреть заставку', 'смотреть титры'],
        skipButton: ['пропустить', 'следующая серия'],
        default: [] // по умолчанию не кликаем по кнопкам
    };

    const STORAGE_KEY = 'kino_autoclick_scenario';

    let currentScenario = GM_getValue(STORAGE_KEY, 'default');
    let observer = null;

    function clickMatchingButtons() {
        if (currentScenario === 'default') {
            // По умолчанию не кликаем
            return;
        }

        const group = document.querySelector('[data-tid="SkipButtonGroup"]');
        if (!group) return;

        const buttons = group.querySelectorAll('button');

        buttons.forEach((btn) => {
            const fullText = btn.innerText.trim().toLowerCase();
            if (SCENARIOS[currentScenario].some(target => fullText.includes(target))) {
                console.log('▶️ Автоклик по кнопке:', fullText);
                btn.click();
            }
        });
    }

    function startObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            clickMatchingButtons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setScenario(scenario) {
        currentScenario = scenario;
        GM_setValue(STORAGE_KEY, currentScenario);
        alert(`Выбран сценарий: ${scenario === 'default' ? 'По умолчанию' : scenario === 'showTrailerAndCredits' ? 'Смотреть заставку/титры' : 'Пропустить'}`);
        startObserver();
        clickMatchingButtons();
    }

    // Регистрируем команды меню
    GM_registerMenuCommand('Сценарий: Смотреть заставку/титры', () => setScenario('showTrailerAndCredits'));
    GM_registerMenuCommand('Сценарий: Пропустить', () => setScenario('skipButton'));
    GM_registerMenuCommand('Сценарий: По умолчанию (без автоклика)', () => setScenario('default'));

    // Запуск при загрузке
    startObserver();
    clickMatchingButtons();

})();
