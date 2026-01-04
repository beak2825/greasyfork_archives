// ==UserScript==
// @name         Club finance english/finnish
// @namespace    https://trophymanager.com/
// @version      1.5
// @description  Shows club finance level as a color-coded money range. Works with both Finnish and English language settings.
// @author       Created by https://trophymanager.com/club/4657703
// @license      MIT
// @match        https://trophymanager.com/club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540552/Club%20finance%20englishfinnish.user.js
// @updateURL https://update.greasyfork.org/scripts/540552/Club%20finance%20englishfinnish.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const talousMapFi = {
        "Hirvittävä": ["<−200,000,000$"],
        "Surullinen": ["−200,000,000$", "−50,000,000$"],
        "Erittäin surkea": ["−50,000,000$", "0$"],
        "Surkea": ["0$", "5,000,000$"],
        "OK": ["5,000,000$", "15,000,000$"],
        "Hieno": ["15,000,000$", "30,000,000$"],
        "Hyvä": ["30,000,000$", "75,000,000$"],
        "Erittäin hyvä": ["75,000,000$", "150,000,000$"],
        "Varakas": ["150,000,000$", "250,000,000$"],
        "Rikas": ["250,000,000$", "400,000,000$"],
        "Hyvin rikas": ["400,000,000$", "600,000,000$"],
        "Fantastisen rikas": ["600,000,000$", "1,000,000,000$"],
        "Uskomattoman rikas": ["1,000,000,000$", "1,500,000,000$"],
        "Ökyrikas": [">1,500,000,000$"]
    };

    const talousMapEn = {
        "Terrible": ["<−200,000,000$"],
        "Grave": ["−200,000,000$", "−50,000,000$"],
        "Very poor": ["−50,000,000$", "0$"],
        "Poor": ["0$", "5,000,000$"],
        "Ok": ["5,000,000$", "15,000,000$"],
        "Fine": ["15,000,000$", "30,000,000$"],
        "Good": ["30,000,000$", "75,000,000$"],
        "Really good": ["75,000,000$", "150,000,000$"],
        "Wealthy": ["150,000,000$", "250,000,000$"],
        "Rich": ["250,000,000$", "400,000,000$"],
        "Very rich": ["400,000,000$", "600,000,000$"],
        "Fantastically rich": ["600,000,000$", "1,000,000,000$"],
        "Incredibly rich": ["1,000,000,000$", "1,500,000,000$"],
        "Astonishingly rich": [">1,500,000,000$"]
    };

    const redCategories = [
        "Hirvittävä", "Surullinen", "Erittäin surkea",
        "Terrible", "Grave", "Very poor"
    ];

    function muutaTalous() {
        const strongs = document.querySelectorAll('strong');

        for (const strong of strongs) {
            const label = strong.textContent.trim();

            if (label === "Talous:" || label === "Economy:") {
                const parent = strong.parentNode;
                const siblings = Array.from(parent.childNodes);
                const index = siblings.indexOf(strong);
                const nextNode = siblings[index + 1];

                if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
                    const origText = nextNode.textContent.trim();
                    const rahaväli = talousMapFi[origText] || talousMapEn[origText];

                    if (rahaväli) {
                        const color = redCategories.includes(origText) ? "red" : "lightgreen";
                        const span = document.createElement("span");

                        span.innerHTML = " (" +
                            `<span style="color:${color}">${rahaväli[0]}</span>` +
                            (rahaväli.length === 2
                                ? ` <span style="color:white">–</span> <span style="color:${color}">${rahaväli[1]}</span>`
                                : "") +
                            ")";

                        nextNode.textContent = ` ${origText}`;
                        parent.insertBefore(span, nextNode.nextSibling);
                    }
                }

                break;
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", muutaTalous);
    } else {
        muutaTalous();
    }

})();