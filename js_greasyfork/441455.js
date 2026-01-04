// ==UserScript==
// @name         [broken, use mapgenie.io] Elden Ring Fextralife fullscreen map redirect
// @namespace    https://greasyfork.org/en/users/12725-alistair1231
// @version      0.1.2
// @description  redirects to fullscreen map when opening a map link
// @author       Alistair1231
// @match        https://eldenring.wiki.fextralife.com/Interactive+Ma*
// @match        https://eldenring.wiki.fextralife.com/Interactive+ma*
// @match        https://eldenring.wiki.fextralife.com/interactive+ma*
// @match        https://eldenring.wiki.fextralife.com/interactive+Ma*
// @icon         https://icons.duckduckgo.com/ip2/fextralife.com.ico
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/441455/%5Bbroken%2C%20use%20mapgenieio%5D%20Elden%20Ring%20Fextralife%20fullscreen%20map%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/441455/%5Bbroken%2C%20use%20mapgenieio%5D%20Elden%20Ring%20Fextralife%20fullscreen%20map%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var map = Array.from(document.getElementsByTagName("iframe")).filter(x => x.classList.contains("interactivemapcontainer") && x.parentElement.parentElement.style.display!="none")[0];
    document.location=map.src;
})();


