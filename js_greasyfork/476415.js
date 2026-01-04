// ==UserScript==
// @name         Auto Click Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks a button when it appears in the background
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476415/Auto%20Click%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/476415/Auto%20Click%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция, которая будет вызываться при появлении кнопки в фоне
    function clickButton() {
        var button = document.querySelector('div button.roll_btnRoll__S1Jq_');
        if (button) {
            button.click();
        }
    }

    // Отслеживание изменений в DOM с помощью MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                clickButton();
            }
        });
    });

    // Запуск отслеживания изменений в DOM после загрузки страницы
    window.addEventListener('load', function() {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();