// ==UserScript==
// @name         gurufocus cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       skrishtofenko
// @match        https://www.gurufocus.com/
// @icon         https://www.google.com/s2/favicons?domain=gurufocus.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424137/gurufocus%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/424137/gurufocus%20cleaner.meta.js
// ==/UserScript==

function clearPage() {
    ['div.el-dialog__wrapper', 'div.v-modal', 'div.paywall-shadow'].forEach(selector => {
        let elems = document.querySelectorAll(selector);

        if (elems.length) {
            elems.forEach(elem => {
                elem.parentNode.removeChild(elem)
            })
        }
    });
}

(function() {
    'use strict';

    setTimeout(clearPage, 1000);
})();