// ==UserScript==
// @name         Adblock message reload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reload the page if the adblock message pops up
// @author       SH4DOW4RE
// @match        *://*.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496666/Adblock%20message%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/496666/Adblock%20message%20reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var to;

    to = setInterval(() => {
        if (document.querySelector("#container.style-scope ytd-enforcement-message-view-model #title.style-scope ytd-enforcement-message-view-model") != undefined) {
            clearInterval(to);
            alert("Found the bitch");
        }
    }, 100);
})();