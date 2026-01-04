// ==UserScript==
// @name         isnailweibo autoclick
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto click button!
// @author       snaillonely
// @match        http://43.138.16.189/
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/476663/isnailweibo%20autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/476663/isnailweibo%20autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    countDown = setInterval(() => {
        GM_log("button clicked");
        var btn = document.querySelector("#component-13")
        btn.click()
    }, 30000)
})();