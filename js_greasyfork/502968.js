// ==UserScript==
// @name            DungeonsOfTheWell profile page: add info about rune's percentage
// @name:ru         Добавление процентного соотношения найденных рун на странице профиля игры "Подземелья колодца"
// @namespace       http://tampermonkey.net/
// @version         2025-08-03
// @description     Adds rounded up percentage value to the progress bars' text on DungeonsOfTheWell profile page
// @description:ru  Добавляет информацию о процентном соотношении найденных рун (с округлением вверх) на странице "Журнал -> Руны усиления" на странице профиля игры "Подземелья колодца"
// @author          You
// @match           https://vip3well.activeusers.ru/app.php?act=pages&id=618*
// @match           https://welldungeon.online/?act=pages&id=618*
// @icon            none
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/502968/DungeonsOfTheWell%20profile%20page%3A%20add%20info%20about%20rune%27s%20percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/502968/DungeonsOfTheWell%20profile%20page%3A%20add%20info%20about%20rune%27s%20percentage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateProgressBarValue(element) {
        const value = element.innerText.split('/')[0];
        const total = element.innerText.split('/')[1];
        const percentage = Math.round((value / total) * 100);
        element.innerText = `${value}/${total} (${percentage}%)`;
    }

    const progressBars = [
        document.querySelector("#w_376 > div > b > div:nth-child(2) > div"),
        document.querySelector("#w_376 > div > b > div:nth-child(6) > div"),
        document.querySelector("#w_376 > div > b > div:nth-child(11) > div"),
        document.querySelector("#w_376 > div > b > div:nth-child(15) > div"),
        document.querySelector("#w_376 > div > b > div:nth-child(19) > div"),
        document.querySelector("#w_376 > div > b > div:nth-child(24) > div")
    ];

    progressBars.forEach(updateProgressBarValue);
})();