// ==UserScript==
// @name         No Gay Youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove some sinful ad content on youtube during pride month
// @author       You
// @match        https://www.youtube.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none_lol
// @downloadURL https://update.greasyfork.org/scripts/445928/No%20Gay%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/445928/No%20Gay%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("img").remove();
    document.getElementById("logo").remove();

})();