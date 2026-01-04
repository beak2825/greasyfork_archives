// ==UserScript==
// @name         Facebook Debloater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Debloat Facebook
// @author       mut-ex
// @match        https://www.facebook.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520832/Facebook%20Debloater.user.js
// @updateURL https://update.greasyfork.org/scripts/520832/Facebook%20Debloater.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideCrap() {

        // Select all divs with the classes "m" and "displayed"

        const divs = document.querySelectorAll('div.m.displayed');
        divs.forEach(div => {

            // Hide stories
            const storiesDiv = div.querySelector('div.m.hscroller');
            if (storiesDiv) {
                div.style.display = 'none';
            }

            // Hide sponsored
            const sponsoredSpans = div.querySelectorAll('span.f5');
            sponsoredSpans.forEach(span => {
                if (span.textContent.startsWith("Sponsored")) {
                    div.style.display = 'none';
                }
            });

            // Hide 'Follow suggestions'
            const followSpans = div.querySelectorAll('span.f2');
            followSpans.forEach(span => {
                if (span.innerText === "Follow") {
                    div.style.display = 'none';
                }
            });

        });
    }
    setInterval(hideCrap, 1000);
})();
