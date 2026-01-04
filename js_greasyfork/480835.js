// ==UserScript==
// @name         Lag killer test
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  Anti lag to smach noobs!
// @author       dark craexerzim
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480835/Lag%20killer%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/480835/Lag%20killer%20test.meta.js
// ==/UserScript==
alert: ("Game with Lag killer. the game mod on test!")
(function() {
    'use strict';
    requestAnimationFrame = (i) => setTimeout(i, 1e3/350)
})();