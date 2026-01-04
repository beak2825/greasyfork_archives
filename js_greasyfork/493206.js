// ==UserScript==
// @name         Diep.io Net Predict Movement False
// @version      1.1
// @namespace    http://tampermonkey.net/
// @match        *://diep.io/*
// @grant        none
// @description Automatically disables net predict movement in diep.io.
// @downloadURL https://update.greasyfork.org/scripts/493206/Diepio%20Net%20Predict%20Movement%20False.user.js
// @updateURL https://update.greasyfork.org/scripts/493206/Diepio%20Net%20Predict%20Movement%20False.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setColor = setInterval(() => {
           input.set_convar("net_predict_movement", false);
           clearInterval(setColor);
    });
})();