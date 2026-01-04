// ==UserScript==
// @name         investing cleaner
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       skrishtofenko
// @match        https://ru.investing.com/
// @icon         https://www.google.com/s2/favicons?domain=investing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424141/investing%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/424141/investing%20cleaner.meta.js
// ==/UserScript==

function clearPage() {
    ['div.adBlock-popup_popup--adblock-detected__fu1VO', 'div.overlay_overlay__LXlPB', '#abPopup'].forEach(selector => {
        let elems = document.querySelectorAll(selector);

        if (elems.length) {
            elems.forEach(elem => {
                elem.parentNode.removeChild(elem)
            })
        }
    });

    document.querySelector('body').style.overflow='auto';
}

(function() {
    'use strict';

    setTimeout(clearPage, 1000);
})();
