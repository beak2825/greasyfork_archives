// ==UserScript==
// @name         Dsrealm link updater
// @namespace    https://greasyfork.org/en/users/195019-airminer
// @version      0.4
// @description  Update old links on Dsrealm
// @author       airminer
// @match        https://dsrealmtranslations.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370105/Dsrealm%20link%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/370105/Dsrealm%20link%20updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    [].forEach.call(document.querySelectorAll('a[href*="dsrealm.com"]'), function(item) {
        item.href = item.href.replace(/dsrealm\.com/,"dsrealmtranslations.com");
    });
    [].forEach.call(document.querySelectorAll('a[href*="lucksego.com"]'), function(item) {
        item.href = item.href.replace(/lucksego\.com/,"dsrealmtranslations.com");
    });
})();