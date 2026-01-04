// ==UserScript==
// @name         SteamDB Adult Mode

// @version      0.2
// @description  Undo all mosaic and filters on SteamDB
// @match        https://steamdb.info/*/screenshots/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant        none
// @license MIT
// @namespace http://mayuyu.io
// @downloadURL https://update.greasyfork.org/scripts/458823/SteamDB%20Adult%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/458823/SteamDB%20Adult%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.addEventListener('load', function() {
    document.getElementById("js-view-adult-screenshots").click()
}, false);
})();