// ==UserScript==
// @name         Refresh mining statics every minute
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Refresh mining statics every minute.
// @author       Santeri Hetekivi
// @match        https://*.2miners.com/account/*
// @match        https://*.miningpoolhub.com/index.php?page=dashboard
// @match        https://*.ethermine.org/miners/*/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438152/Refresh%20mining%20statics%20every%20minute.user.js
// @updateURL https://update.greasyfork.org/scripts/438152/Refresh%20mining%20statics%20every%20minute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(
        function()
        {
            location.reload();
        },
        60000
    );
})();