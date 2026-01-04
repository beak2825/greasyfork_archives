// ==UserScript==
// @name         BloxFlip.com Element Fix
// @version      1.0
// @description  Fix flashing elements
// @author       Mohalk
// @namespace    http://tampermonkey.net/
// @match        https://bloxflip.com/*
// @downloadURL https://update.greasyfork.org/scripts/477436/BloxFlipcom%20Element%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/477436/BloxFlipcom%20Element%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        window.scrollBy(0, 1.11111111);
        setTimeout(function() {
            window.scrollBy(0, -1.11111111);
        }, 0.01);
    }, 750);
})();