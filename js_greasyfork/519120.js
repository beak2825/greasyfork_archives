// ==UserScript==
// @name         Torn-Access
// @namespace    rDacted
// @version      20250108
// @description  Attempts to make some pages on torn more accessible
// @author       rDacted[2670953]
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519120/Torn-Access.user.js
// @updateURL https://update.greasyfork.org/scripts/519120/Torn-Access.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.startsWith("https://www.torn.com/loader.php?sid=attackLog&ID=")) {
        // Add a "!" to the end of the damage amounts to separate them from the time in the adjacent cell
        $('.action-log').find('em').each(function() {
            $(this).text($(this).text() + '! ');
        });
    }
})();
