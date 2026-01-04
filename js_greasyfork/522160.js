// ==UserScript==
// @name         Remove Habblet Client Ads
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  idk
// @author       xor
// @match        *://*.habblet.city/hotel*
// @icon         https://www.habblet.city/assets/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522160/Remove%20Habblet%20Client%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/522160/Remove%20Habblet%20Client%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('body > div:not([id])')?.remove();
    document.getElementById("area_player")?.remove();
})();
