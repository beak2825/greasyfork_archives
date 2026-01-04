// ==UserScript==
// @name         Champions Hockey League
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Vytváří záložku "Tracking" která přesměruje do PDF.
// @author       MK
// @match        https://www.chl.hockey/en/matches/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482219/Champions%20Hockey%20League.user.js
// @updateURL https://update.greasyfork.org/scripts/482219/Champions%20Hockey%20League.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onhashchange = function() {
        if (location.href.includes('tab_event=tracking')) {
            setTimeout(function() {
                let iframe = document.querySelector('section > iframe');
                if (iframe) {
                    let iframeSrc = iframe.src;
                    let numberMatch = iframeSrc.match(/\d+$/);
                    if (numberMatch) {
                        let id = numberMatch[0];

                        let newUrl = "https://chl.hokejovyzapis.cz/pdf/print/de-html/" + id;
                        window.location.href = newUrl;

                        let liveUrl = "https://chlvisualization.laura.esports.cz/deserve2win/" + id;
                        window.open(liveUrl, '_blank');
                    } else {
                        console.log('Žádné číslo nebylo nalezeno v URL iframe.');
                    }
                } else {
                    console.log('Žádný iframe nebyl nalezen.');
                }
            }, 1000);
        }
    };

    setTimeout(function() {
        let trackingElement = document.querySelector('menuitem[data-target="tracking"]');
        if (trackingElement) {
            trackingElement.style.display = 'inline';
        }
    }, 2500);
})();