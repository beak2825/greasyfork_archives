// ==UserScript==
// @name         Diep.io FPS Counter and Disable Movement Prediction
// @version      1.0.0
// @description  Script for diep.io
// @author       Discord: anuryx. (Github: XyrenTheCoder)
// @match        *://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @namespace https://greasyfork.org/users/1496700
// @downloadURL https://update.greasyfork.org/scripts/543181/Diepio%20FPS%20Counter%20and%20Disable%20Movement%20Prediction.user.js
// @updateURL https://update.greasyfork.org/scripts/543181/Diepio%20FPS%20Counter%20and%20Disable%20Movement%20Prediction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loadInterval = setInterval(() => {
        if(window.input) {
            window.input.set_convar("ren_fps", true);
            window.input.set_convar("net_predict_movement", false);
            clearInterval(loadInterval);
        }
    }, 5000);
})();
