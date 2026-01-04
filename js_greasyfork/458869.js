// ==UserScript==
// @name         tap the time
// @namespace    redacted
// @version      0.2
// @description  clicking the time
// @author       redacted
// @match        https://blaseball.com/*
// @match        https://www.blaseball.com/*
// @downloadURL https://update.greasyfork.org/scripts/458869/tap%20the%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/458869/tap%20the%20time.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const NAMESPACE = "tap the time";
    const WINRATE = "w/l ration?"
    const ODDS = "odds above what %?"

    if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_OPTIONS_REGISTER")) {
        document._BLASEBALL_USERSCRIPT_OPTIONS_REGISTER(NAMESPACE, WINRATE, false, "checkbox");
        document._BLASEBALL_USERSCRIPT_OPTIONS_REGISTER(NAMESPACE, ODDS, 50, "number");
    }

    function getOption(option, defaultValue) {
        if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_OPTIONS_GET")) {
            return document._BLASEBALL_USERSCRIPT_OPTIONS_GET(NAMESPACE, option);
        }

        return defaultValue;
    }

    function chooseBet(game) {
        const data = game.querySelectorAll(".bet-widget__data");
        const awayData = data[0];
        const homeData = data[1];

        if (getOption(WINRATE, "false")) {
            const awayRecord = Number(awayData.querySelector(".bet-widget__record").innerText.split("-")[0]);
            const homeRecord = Number(homeData.querySelector(".bet-widget__record").innerText.split("-")[0]);

            if (awayRecord > homeRecord) {
                return awayData.click();
            }
            if (homeRecord > awayRecord) {
                return homeData.click();
            }
        }

        const minAdvantage = getOption(ODDS) - 50;

        const awayOdds = Number(awayData.querySelector(".bet-widget__odds").innerText.split("%")[0]);

        if (awayOdds >= 50 + minAdvantage) {
            return awayData.click();
        }
        if (awayOdds <= 50 - minAdvantage) {
            return homeData.click();
        }
    }

    const callback = function(mutationsList) {
        const main = document.getElementsByTagName("body")[0];
        for (const time of main.querySelectorAll(".hour__time")) {
            if (time.listenerSet !== undefined) {
                continue;
            }

            time.addEventListener("click", function() {
                const section = this.parentNode.parentNode;
                section.querySelectorAll(".bet-widget__bet").forEach(chooseBet);
            });

            time.listenerSet = true;
        }
        mutationsList.forEach((mutation) => {
            if (mutation.type == "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node && node.classList && node.classList.contains("bet-widget__wager")) {
                        node.childNodes[3].click();
                    }
                });
            }
        });
    };

    if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_REGISTER")) {
        document._BLASEBALL_USERSCRIPT_REGISTER(NAMESPACE, callback, (mutations) => (document.querySelector(".hour__time")));
    } else {
        const main = document.getElementsByTagName("body")[0];
        const config = { childList: true, subtree: true };
        const mutationCallback = function(mutationsList, observer) {
            callback(mutationsList);

            observer.disconnect();
            observer.observe(main, config);
        };

        const observer = new MutationObserver(mutationCallback);
        observer.observe(main, config);
    }
})();