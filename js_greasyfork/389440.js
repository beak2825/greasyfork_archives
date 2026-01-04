// ==UserScript==
// @name         Dev Refresher
// @namespace    https://michaeljmiller.net/
// @version      0.1
// @description  Dev Refresher Script
// @author       Michael Miller
// @match        https://entergy-perf.planetecosystems.com
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/389440/Dev%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/389440/Dev%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("I am here");
    setInterval(function() {
        location.reload();
    }, 100);
})();