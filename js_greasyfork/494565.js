// ==UserScript==
// @name         Steam 3rd Party Account Warning
// @author       Unbroken
// @namespace    https://store.steampowered.com
// @version      1.11
// @description  Warns you if a game on Steam requires a 3rd party account.
// @icon         https://www.google.com/s2/favicons?domain=store.steampowered.com
// @match        https://store.steampowered.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494565/Steam%203rd%20Party%20Account%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/494565/Steam%203rd%20Party%20Account%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.querySelectorAll('.DRM_notice');

    for (var i = 0; i < div.length; ++i) {
        if(div[i].textContent.includes('Requires 3rd-Party Account')){
            div[i].style.backgroundColor = 'yellow';
            div[i].style.color = 'black';

            var title = document.getElementById('appHubAppName');

            title.style.color = 'yellow';
            title.textContent += ' [Requires 3rd-Party Account]';
        }
        else if (div[i].textContent.includes('3rd-party DRM')){
            div[i].style.backgroundColor = 'red';
        }
    }
})();