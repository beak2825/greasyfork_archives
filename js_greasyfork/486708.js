// ==UserScript==
// @name         SteamBuy Particles Hide
// @description  Removes element with heavy particles animation to reduce CPU load
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Mikhail Klimenko
// @match        https://steambuy.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/486708/SteamBuy%20Particles%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/486708/SteamBuy%20Particles%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide canvas with particles to reduce CPU load
    var el = document.getElementById('particles-js');
    el.style.display = 'none';
})();