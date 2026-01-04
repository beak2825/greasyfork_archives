// ==UserScript==
// @name         FPS Increaser
// @namespace    http://tampermonkey.net/
// @version      0.11111111
// @description  Increases FPS in game if your monitor can handle it. Do not use if you have a high refresh rate monitor (i.e. over 60hz)
// @author       Revo and gonials
// @match         https://*.tankionline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445061/FPS%20Increaser.user.js
// @updateURL https://update.greasyfork.org/scripts/445061/FPS%20Increaser.meta.js
// ==/UserScript==
(function() {
    'use strict';

let MAX = 200;
requestAnimationFrame = (a) => setTimeout(a, 1e3/MAX)
})();