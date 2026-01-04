// ==UserScript==
// @name         Starblast 1 Station Team Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to make a 1 station team mode game
// @author       Dmitry Pleshkov
// @match        https://starblast.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40907/Starblast%201%20Station%20Team%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/40907/Starblast%201%20Station%20Team%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function allowOneStation() {
        var input = document.getElementById("friendly_colors");
        if (input != null) {
            if (input.min == "2") {
                input.min = "1";
            }
        }
        input = document.getElementById("shield_regen_factor");
        if (input != null) {
            if (input.max == "2") {
                input.min = "-10000";
                input.max = "10000";
            }
        }
        input = document.getElementById("power_regen_factor");
        if (input != null) {
            if (input.max == "2") {
                input.min = "-10000";
                input.max = "10000";
            }
        }
    }
    setInterval(allowOneStation, 100);
})();