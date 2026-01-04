// ==UserScript==
// @name         Youtube Auto Continue
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       ahkui <ahkui@outlook.com>
// @match        https://*.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393148/Youtube%20Auto%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/393148/Youtube%20Auto%20Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        if(document.querySelector('#confirm-button') !== null) {
            document.querySelector('#confirm-button').click()
        } else if(document.querySelector('[dialog-confirm]') !== null) {
            document.querySelector('[dialog-confirm]').click()
        }
    }, 100)
})();