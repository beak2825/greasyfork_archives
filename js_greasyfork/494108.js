// ==UserScript==
// @name         FPS Booster 2
// @namespace http://tampermonkey.net/
// @version 2 (final)
// @description  remove lag enjoy🐓
// @author       Mr-Chimken_Lord
// @grant quit lag
// @match *://arras.io/*
// @match *://sandbox.moomoo.io/*
// @match *://moomoo.io/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494108/FPS%20Booster%202.user.js
// @updateURL https://update.greasyfork.org/scripts/494108/FPS%20Booster%202.meta.js
// ==/UserScript==
(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/MIN)
})();// ==UserScript==