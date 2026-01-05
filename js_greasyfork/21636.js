// ==UserScript==
// @name Cookie Master
// @namespace Cookie
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1
// @grant none
// @description Loads the CookieMaster helper tool for CookieClicker Idle game
// @downloadURL https://update.greasyfork.org/scripts/21636/Cookie%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/21636/Cookie%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.appendChild(document.createElement('script')).src='//cookiemaster.creatale.de/b?c='+Date.now();
})();

