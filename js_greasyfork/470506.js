// ==UserScript==
// @name         FPS Booster
// @namespace http://tampermonkey.net/
// @version 1.4
// @description  oh yes the old name returns
// @author       The Lag Killer
// @grant
// @match *://agar.io/*
// @match *://sploop.io/*
// @match *://mineenergy.fun/*
// @match *://sandbox.moomoo.io/*
// @match *://starve.io/*
// @match *://taming.io/*
// @match *://arras.io/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470506/FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/470506/FPS%20Booster.meta.js
// ==/UserScript==
(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/-100000000000000000000000000000000000000000000000000000000000000000000000)
})();// ==UserScript==