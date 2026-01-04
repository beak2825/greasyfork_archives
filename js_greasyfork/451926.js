// ==UserScript==
// @name         FUT 23 Transfer list to 100
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increase size of Transfer list to 100 (instead of default 30)
// @author       anbano
// @match        https://www.ea.com/fifa/ultimate-team/web-app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ea.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451926/FUT%2023%20Transfer%20list%20to%20100.user.js
// @updateURL https://update.greasyfork.org/scripts/451926/FUT%2023%20Transfer%20list%20to%20100.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        services.User.maxAllowedAuctions = 100;
    }, 20000)
})();