// ==UserScript==
// @name         moteurnature.com
// @namespace    http://tampermonkey.net/
// @version      2023-12-21-2
// @description  plus de refus de cookies impossible sans altérer la navigation
// @author       Phil
// @match        https://www.moteurnature.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moteurnature.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/482840/moteurnaturecom.user.js
// @updateURL https://update.greasyfork.org/scripts/482840/moteurnaturecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

    sleep(1000).then(() => { $('#'+'rang3largeur3').css('opacity', 1); });

})();