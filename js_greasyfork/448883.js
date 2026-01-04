// ==UserScript==
// @name         net predict movement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  after a few updates this stopped working so I decided to fix it, I got tired of manually putting in this command.
// @author       Aspect(I think)
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448883/net%20predict%20movement.user.js
// @updateURL https://update.greasyfork.org/scripts/448883/net%20predict%20movement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setColor = setInterval(() => {
           input.set_convar("net_predict_movement", false);
           input.set_convar("ren_minimap_viewport", false);
           clearInterval(setColor);
    });
})();