// ==UserScript==
// @name         Kimovil Only Global Phone Versions
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes non-global phone versions from www.kimovil.com
// @author       salar2k
// @match        https://www.kimovil.com/en/best-smartphones-antutu
// @icon         https://www.google.com/s2/favicons?domain=kimovil.com
// @grant        none
// @include        *://*.kimovil.com/*
// @downloadURL https://update.greasyfork.org/scripts/432202/Kimovil%20Only%20Global%20Phone%20Versions.user.js
// @updateURL https://update.greasyfork.org/scripts/432202/Kimovil%20Only%20Global%20Phone%20Versions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeNonGlobal() {
        var smartphones = document.querySelectorAll("li.item.smartphone");
        var removedList = [];
        smartphones.forEach((e, index) => {
            var version = e.querySelector('.device-name .version')?.textContent;
            var title = e.querySelector('.device-name .title')?.textContent;

            if (version && !version.includes('Global') && !version.includes('International')) {
                e.remove();

                removedList.push(`${title} - ${version}`);
            }
        });

        if (removedList.length) {
            console.log('Non-global devices removed', removedList);
        }
    }

    removeNonGlobal();

    var scrollTimer = null;
    window.addEventListener("scroll", function () {
        if (scrollTimer)
            this.clearTimeout(scrollTimer);

        scrollTimer = setTimeout(removeNonGlobal, 500);
    });

    // Your code here...
})();