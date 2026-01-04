// ==UserScript==
// @name         Shellshock.io Adblocker v0.1
// @namespace    http://
// @version      0.1
// @description  A simple ad-blocker for shellshockers. Note: May not work on Brave Browser.
// @author       NinjaUser
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441761/Shellshockio%20Adblocker%20v01.user.js
// @updateURL https://update.greasyfork.org/scripts/441761/Shellshockio%20Adblocker%20v01.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('gameAdContainer').remove();
    document.getElementById('videoAdContainer').remove();
    document.getElementById('ad_unit').remove();
})();