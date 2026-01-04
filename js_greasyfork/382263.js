// ==UserScript==
// @name         net predict movement
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  h
// @author       Aspect
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382263/net%20predict%20movement.user.js
// @updateURL https://update.greasyfork.org/scripts/382263/net%20predict%20movement.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setColor = setInterval(() => {
        if(document.getElementById("loading").innerText===""){
           input.set_convar("net_predict_movement", false);
           input.set_convar("ren_minimap_viewport", true);
           clearInterval(setColor);
        }
    });
})();