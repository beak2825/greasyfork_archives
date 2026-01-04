// ==UserScript==
// @name         Auto Select No on lolz.live, zelenka.guru, and lzt.market
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  123
// @author       You
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505048/Auto%20Select%20No%20on%20lolzlive%2C%20zelenkaguru%2C%20and%20lztmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/505048/Auto%20Select%20No%20on%20lolzlive%2C%20zelenkaguru%2C%20and%20lztmarket.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Функция для выбора опции "Нет" по умолчанию
    function selectNoOption() {
        const noOption = document.querySelector('input[name="telegram_deal"][value="0"]');
        const yesOption = document.querySelector('input[name="telegram_deal"][value="1"]');

        // Если "Нет" не выбрано, то выбираем его
        if (noOption && !noOption.checked) {
            noOption.checked = true;
            noOption.dispatchEvent(new Event('change'));
        }
    }

    // Устанавливаем "Нет" по умолчанию при загрузке страницы
    window.addEventListener('load', selectNoOption);

    // Добавляем MutationObserver для обработки изменений DOM, но разрешаем переключение на "Да"
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                selectNoOption();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
})();