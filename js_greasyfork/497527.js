// ==UserScript==
// @name         HamsterCards
// @namespace    http://tampermonkey.net/
// @version      2024-06-10
// @description  Поиск самых выгодных карточек Hamster Kombat для покупки. Вывод в консоли.
// @author       SPomodor
// @match        *://hamsterkombat.io/ru/clicker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497527/HamsterCards.user.js
// @updateURL https://update.greasyfork.org/scripts/497527/HamsterCards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (var i = 0; i < localStorage.length; i++){
        console.log(localStorage.getItem(localStorage.key(i)));
    };

    function clickRetryButton() {
        let longestString = "";

        for (let i = 0; i < localStorage.length; i++) {
            const value = localStorage.getItem(localStorage.key(i));
            if (value.length > longestString.length) {
                longestString = value;
            }
        }

        const auth = longestString;
        fetch("https://api.hamsterkombat.io/clicker/upgrades-for-buy", {
  "headers": {
    "authorization": "Bearer "+auth,
  },
  "method": "POST",

        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
            const upgrades = data.upgradesForBuy;
            const ProfInHour = [];

            for (const up of upgrades) {
                if (up.isAvailable && !up.isExpired && up.cooldownSeconds == 0) {
                    if (up.price !== 0 && up.profitPerHour !== 0) {
                        const hours = up.price / (up.profitPerHour + up.profitPerHourDelta);
                        ProfInHour.push({
                            section: up.section,
                            id: up.id,
                            name: up.name,
                            hours: hours,
                            price: up.price,
                            profitPerHour: up.profitPerHour+up.profitPerHourDelta,
                        });
                    }
                }
            }

            const sorted = ProfInHour.sort((a, b) => a.hours - b.hours);

            for (let i = 0; i < 10; i++) {
                const priceString = sorted[i].price.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                const profitString = sorted[i].profitPerHour.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                console.log(
                    `section: ${sorted[i].section} | name: ${sorted[i].name} | hours: ${Math.round(sorted[i].hours)} | price: ${priceString} | profitPerHour: ${profitString}`
                );
            }

        })
            .catch(error => {
            // Обработка ошибок
            console.error('Ошибка:', error);
        });
    }

    setTimeout(clickRetryButton, 2000);
    // Your code here...
})();