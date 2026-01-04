// ==UserScript==
// @name         Нажатие на кнопку покупки аккаунтов без проверки валида
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Нажимает за тебя на кнопку подтвердить без проверки валида
// @license      MIT
// @match        https://lzt.market/*
// @downloadURL https://update.greasyfork.org/scripts/482944/%D0%9D%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D1%83%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%BE%D0%B2%20%D0%B1%D0%B5%D0%B7%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482944/%D0%9D%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20%D0%BD%D0%B0%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D1%83%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82%D0%BE%D0%B2%20%D0%B1%D0%B5%D0%B7%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B8%20%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function Click() {
        const buyButtons = document.querySelectorAll('[id^="BuyWithoutValidationButton"]');
        if (buyButtons.length > 0) {
            buyButtons[0].click();
            setTimeout(clickonbutton, 300);
        }
    }

    function clickonbutton() {
        const confirmButton = document.querySelector('#ctrl_buy_without_validation_Disabler');
        if (confirmButton) {
            confirmButton.click();
        }
    }

    setInterval(Click, 400);
})();
