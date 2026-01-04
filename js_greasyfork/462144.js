// ==UserScript==
// @name ManyBoostFPS
// @author DragonFrostIce
// @description Have less effect on 60hz+pc
// @icon https://www.google.com/s2/favicons?sz=64&domain=manyland.com
// @version 0.1
// @match *://manyland.com/*
// @run-at document-start
// @grant none
// @namespace https://greasyfork.org/ru/users/789263-dragonfrostice
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462144/ManyBoostFPS.user.js
// @updateURL https://update.greasyfork.org/scripts/462144/ManyBoostFPS.meta.js
// ==/UserScript==

(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/1000)
})();