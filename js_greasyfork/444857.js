// ==UserScript==
// @name     Grey not White
// @version  4
// @grant    none
// @description Replace white with grey, and especially on slashdot.org
// @match       *://*/*
// @namespace   n/a
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444857/Grey%20not%20White.user.js
// @updateURL https://update.greasyfork.org/scripts/444857/Grey%20not%20White.meta.js
// ==/UserScript==

(function () {
    if (window.getComputedStyle(document.body, null).getPropertyValue("background-color") == "rgb(255, 255, 255)") {
        console.log("Setting new background color...");
        document.body.setAttribute("style", "background-color: #AAAAAA;");
    }
    var domain='https://'+window.location.hostname.split('.')[window.location.hostname.split('.').length-2]+'.'+window.location.hostname.split('.')[window.location.hostname.split('.').length-1];
  	if (domain == "https://slashdot.org") {
        document.body.setAttribute("style", "background-color: #AAAAAA;");
    }
})();
