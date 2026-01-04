// ==UserScript==
// @name         Diep.io FPS Counter
// @version      1.1
// @namespace    http://tampermonkey.net/
// @match        *://diep.io/*
// @grant        none
// @description Automatically allows you to see your framerate in diep.io.
// @downloadURL https://update.greasyfork.org/scripts/493207/Diepio%20FPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/493207/Diepio%20FPS%20Counter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const setColor = setInterval(() => {
           input.set_convar("ren_fps", true);
           clearInterval(setColor);
    });
})();