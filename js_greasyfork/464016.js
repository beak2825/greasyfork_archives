// ==UserScript==
// @name         popi bands!
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Highlight some of my favorite bands
// @author       PoPi
// @match        https://austinindependentmusic.org/*
// @icon         https://austinindependentmusic.org/favicon.ico
// @grant        window.onmessage
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/464016/popi%20bands%21.user.js
// @updateURL https://update.greasyfork.org/scripts/464016/popi%20bands%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const HIGHLIGHT_COLOR = "#317264";
    const KNOWN_BANDS = [
        "grocery bag",
        "witches exist",
        "slurp the world",
        "elnuh",
        "molly ringworm",
        "gus baldwin",
        "whisk",
        "dead houseplants",
        "proun",
        "die spitz",
        "squamps",
        "ringo deathstarr",
        "left of west",
        "thank you, i'm sorry",
        "kali yuga",
        "bff",
        "queen serene",
        "quinn",
        "quinn decker",
        "billy glitter",
        "rusty dusty",
        "gorbit",
        "mimicking the moths",
        "grandmaster",
        "redbud",
        "sexxpop",
        "sexpop",
        "luxury television",
    ];

    const PREMIUM_COLOR = "#FF0000";
    var CUSTOM_COLORS = {
        "queen serene": PREMIUM_COLOR,
        "slurp the world": PREMIUM_COLOR,
        "luxury television": PREMIUM_COLOR,
        "die spitz": PREMIUM_COLOR,
        "grandmaster": PREMIUM_COLOR,
    };
    function highlight_known_bands() {
        let title = document.querySelector("body > div > div.h-full.w-full.overflow-hidden > div > div.h-full.max-w-4xl.px-4.m-auto > div > div.flex.justify-center.border.border-primary.border-solid > div > h5");
        // page already modified. return.
        if (title.innerText.startsWith("[")) {
            return;
        }
        let bands = document.getElementsByClassName("p-2 border-r border-solid border-gray-med border-b flex grow items-center");
        var favorite_bands = [];

        for (let band of bands) {
            for (var known_band of KNOWN_BANDS) {
                const found_band_string = band.textContent.trim().toLowerCase();
                if (found_band_string.includes(known_band)) {
                    console.log(found_band_string);
                    favorite_bands = favorite_bands.concat(band);
                }
            }
        }

        for (let band of favorite_bands) {
            var hi_band = band.cloneNode(true);
            const found_band_string = band.textContent.trim().toLowerCase();
            var hi_color = HIGHLIGHT_COLOR;

            for (var custom_band of Object.keys(CUSTOM_COLORS)) {
                if (found_band_string.includes(custom_band)) {
                    hi_color = CUSTOM_COLORS[custom_band];
                    break;
                }
            }

            hi_band.innerHTML = '<span style="background-color: ' + hi_color + ';" class="THmo">' + hi_band.getInnerHTML() + '</span>';
            band.parentNode.replaceChild(hi_band, band);
        }

        if ((favorite_bands.length > 0) && (!title.innerText.startsWith("["))) {
            title.innerText = "[" + favorite_bands.length + "] " + title.innerText;
        }

        return favorite_bands;
    }

    async function delayHighlight() {
        let deferred = $.Deferred();
        // delay by 100 ms to load the page
        setTimeout(() => { console.log("[TRIGGER DELAYED EXECUTION]"); highlight_known_bands(); deferred.resolve(); }, 100);
        return deferred.promise();
    }

    // use jquery to delay (this fires multiple times...)
    $(window).on('message', () => delayHighlight());
})();
