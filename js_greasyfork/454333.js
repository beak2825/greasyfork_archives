// ==UserScript==
// @name         Alts, krunker fps booster
// @namespace    http://tampermonkey.net/
// @version      0.11111111
// @description  Change it to whatever website you want just click where it says krunker.io keep the *:// /* and fill in the space with any website you want
// @author       Revo and gonials
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454333/Alts%2C%20krunker%20fps%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/454333/Alts%2C%20krunker%20fps%20booster.meta.js
// ==/UserScript==
(function() {
    'use strict';
 
let MAX = 80000;
requestAnimationFrame = (a) => setTimeout(a, 888e6555/MAX)
})();
