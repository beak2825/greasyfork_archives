// ==UserScript==
// @name         TRUSTe Blocker
// @namespace    http://scrumplex.net/
// @version      0.1
// @description  disable annoying TRUSTe alerts
// @author       Scrumplex
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28240/TRUSTe%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/28240/TRUSTe%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var runner = function() {
        var box_overlays = document.getElementsByClassName("truste_box_overlay");
        var overlays = document.getElementsByClassName("truste_overlay");
        var changes = 0;

        for(var i = 0; i < box_overlays.length; i++) {
            var elem = box_overlays[i];
            elem.parentNode.removeChild(elem);
            changes++;
        }
        for(var i = 0; i < overlays.length; i++) {
            var elem = overlays[i];
            elem.parentNode.removeChild(elem);
            changes++;
        }
        if (changes >= 2) {
            clearInterval(interval);
        }
    };

    var interval = setInterval(runner, 100);
})();