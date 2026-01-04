// ==UserScript==
// @name         Warframe Reliquary Fixer
// @namespace    http://swarley.dev
// @version      2025-07-11
// @description  Fix the Warframe Reliquary localizer error
// @author       You
// @match        https://wf.xuerian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuerian.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544113/Warframe%20Reliquary%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/544113/Warframe%20Reliquary%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.L = {[navigator.language]: document._L}
})();