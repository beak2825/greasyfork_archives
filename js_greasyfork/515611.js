// ==UserScript==
// @name         MythicalDash Auto Refresh on Critical Error
// @namespace    https://vgwarden.vercel.app
// @version      1.0
// @description  Fix Mythical Dash Error
// @author       VGWARDEN
// @match        *://*/*
// @grant        none
// @license     Proprietary
// @downloadURL https://update.greasyfork.org/scripts/515611/MythicalDash%20Auto%20Refresh%20on%20Critical%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/515611/MythicalDash%20Auto%20Refresh%20on%20Critical%20Error.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndRefresh() {
        if (document.title.includes('MythicalDash - Critical Error')) {
            location.reload(true); // Refresh the page immediately
        }
    }

    checkAndRefresh();

    setInterval(checkAndRefresh, 5000);
})();
