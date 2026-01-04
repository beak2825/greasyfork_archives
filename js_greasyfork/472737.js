// ==UserScript==
// @name         Plemiona - Farming bez localstorage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Farming bez localstorage
// @author       Ten=Zly
// @match        https://*.plemiona.pl/game.php?*screen=am_farm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472737/Plemiona%20-%20Farming%20bez%20localstorage.user.js
// @updateURL https://update.greasyfork.org/scripts/472737/Plemiona%20-%20Farming%20bez%20localstorage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const lightA = 1;
    const refreshTime = 150;
    const refreshDelta = refreshTime * 0.2;

    $.getScript("https://media.innogamescdn.com/com_DS_PL/skrypty/pomocnik_asystenta_farmienia.js");

    const aButton = $('.farm_icon_a').slice(1);

    DoJob();

    async function DoJob() {
        var light = parseInt($('.unit-item-light').text(), 10);
        await Send(light);
        const minRefresh = refreshTime - refreshDelta;
        const maxRefresh = refreshTime + refreshDelta;
        const refreshInterval = Math.random() * (maxRefresh - minRefresh) + minRefresh;
        setTimeout(() => location.reload(), refreshInterval * 1000);
    }

    async function Send(light) {
        for (let i = 0; i < aButton.length; i++) {
            if(light - lightA < 0) return;
            let classes = $(aButton[i]).attr('class').split(' ');
            let hasNumericClass = classes.some(function (className) {
                return /^farm_village_\d+$/.test(className);
            });

            if (!$(aButton[i]).hasClass('farm_icon_disabled') && hasNumericClass) {
                $(aButton[i]).click();
                light-=lightA;
            }

            let delay = Math.random() * (500 - 300) + 300;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
})();