// ==UserScript==
// @name         StateV Net Updater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  reloads net.statev.de every minute!
// @author       Socius
// @match        https://net.statev.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403868/StateV%20Net%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/403868/StateV%20Net%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        location.reload();
    }, 60000);
})();