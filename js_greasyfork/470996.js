// ==UserScript==
// @name         FPS Booster 2
// @namespace http://tampermonkey.net/
// @version 1.4
// @description  remove lag enjoy
// @author       The Dark Lag
// @grant quit lag
// @match *://agar.io/*
// @match *://sploop.io/*
// @match *://mineenergy.fun/*
// @match *://sandbox.moomoo.io/*
// @match *://starve.io/*
// @match *://taming.io/*
// @match *://arras.io/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470996/FPS%20Booster%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470996/FPS%20Booster%202.meta.js
// ==/UserScript==
(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/MIN)
})();// ==UserScript==