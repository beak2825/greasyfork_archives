// ==UserScript==
// @name FPS booster
// @author suzieenoob
// @description have less effect on 60hz+pc
// @icon https://sploop.io/img/ui/favicon.png
// @version 1.1
// @match *://sploop.io/*
// @match *://www.modd.io/play/two-houses*
// @match *://moomoo.io/*
// @match *://stratums.io/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/3183181
// @downloadURL https://update.greasyfork.org/scripts/450034/FPS%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/450034/FPS%20booster.meta.js
// ==/UserScript==
(function() {
    'use strict';
requestAnimationFrame = (a) => setTimeout(a, 1e3/1000)
})();