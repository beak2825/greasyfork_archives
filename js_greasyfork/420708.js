// ==UserScript==
// @name         AEA web redirection
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  aeaweb is annoying.
// @author       loikein
// @include      *://pubs.aeaweb.org/action/showLinks*
// @grant        none
// @homepageURL  https://greasyfork.org/en/scripts/420708-aea-web-redirection
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420708/AEA%20web%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/420708/AEA%20web%20redirection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link = document.getElementsByTagName("a")[0].href;
    window.open(link, "_self");
})();
