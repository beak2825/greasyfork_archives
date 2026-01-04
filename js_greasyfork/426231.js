// ==UserScript==
// @name         Impfterminservice
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatische akustische Benachrichtigung über neue Impftermine
// @author       Björn Eberhardt
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://*.impfterminservice.de/impftermine/*
// @icon         https://www.google.com/s2/favicons?domain=impfterminservice.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426231/Impfterminservice.user.js
// @updateURL https://update.greasyfork.org/scripts/426231/Impfterminservice.meta.js
// ==/UserScript==
// MIT license used to import to OpenUserJS

// Automatische akustische Benachrichtigung über neue Impftermine

(function() {
    'use strict';

    if (document.location.pathname.includes("suche")) {

        let accept = true;

        const reload = () => {
            if ($(".its-search-step-info a").length >= 1) {
                location.reload();
            } else {
                window.setTimeout(reload, 2500);
            }
        };

        const wait = () => {
            if ([...$(".its-slot-pair-search-item input[type=radio]").map((x, y) => y.checked)].includes(true)) {
            } else if (accept && $(".its-slot-pair-search-radio-btn").length >= 1) {
                let context = new AudioContext()
                let o = context.createOscillator()
                o.type = "square"
                o.connect(context.destination)
                o.start()
                window.setTimeout(() => o.stop(), 300)
                window.setTimeout(wait, 500);
            } else {
                reload();
                window.setTimeout(() => location.reload(), 450000);
            }
        };

        window.setTimeout(() => {
            $(".kv-btn-round.search-filter-button").click();
            window.setTimeout(() => {
                $(".kv-btn-hollow.btn-magenta")[1].onclick = () => {
                    accept = false;
                }
            }, 500);
            window.setTimeout(wait, 500);
        }, 500);

    } else if (document.location.pathname.includes("service")) {

        let makeNoise = false;

        const scream = () => {
            setTimeout(scream, 500);
            if (makeNoise) {
              let context = new AudioContext()
              let o = context.createOscillator()
              o.type = "square"
              o.connect(context.destination)
              o.start()
              setTimeout(() => o.stop(), 300)
            }
        }
        setTimeout(scream, 0);
        const QSA = q => document.querySelectorAll(q);

        const selectAnimation = () => QSA(".display-2.icon-search")[0];
        const noAppointments = () => QSA(".alert")[0] && QSA(".alert")[0].innerText.includes("keine freien Termine");
        const clickableInput = () => QSA(".form-check-input[value='0']")[0];

        const waitLoop = () => {
            if (selectAnimation()) {
                setTimeout(waitLoop, 30000);
            } else if (noAppointments()) {
                setTimeout(waitLoop, 30000);
                clickableInput().click();
            } else {
                makeNoise = true;
                window.onclick = e => e.target === clickableInput() ? null : makeNoise = false;
                scream();
            }
        }

        const initWait = () => {
            clickableInput().removeEventListener("click", initWait);
            waitLoop();
        }

        setTimeout(() => clickableInput().addEventListener("click", initWait), 1000);
    }
})();
