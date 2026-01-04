// ==UserScript==
// @name         Mindtap Copy
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Disable popup when selecting text.
// @author       duoduo
// @match        https://ng.cengage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cengage.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517437/Mindtap%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/517437/Mindtap%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        console.log("mindtapcopy", document.getElementsByTagName("html")[0]);
        document.getElementsByTagName("html")[0].addEventListener("mouseup", event => event.stopPropagation(), true);
    }, 5000);


})();