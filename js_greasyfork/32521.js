// ==UserScript==
// @name         Close adblocker alert
// @namespace    https://www.myfxbook.com
// @version      0.3
// @description  User script that automatically closes the adblocker alert which keeps popping up. Perhaps a design error.
// @author       angelo.ndira@gmail.com
// @match        https://www.myfxbook.com
// @match        https://www.myfxbook.com/*
// @match        http://www.myfxbook.com
// @match        http://www.myfxbook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32521/Close%20adblocker%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/32521/Close%20adblocker%20alert.meta.js
// ==/UserScript==
(function() {
    'use strict';
    try {
        closeAdBlockerLightBox();
    } catch(ex) {
        console.log("Error occurred while closing adblocker alert. " + ex);
    }
})();