// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @include      https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/414024/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/414024/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        if (document.getElementsByClassName('claimable-bonus__icon') && document.getElementsByClassName('claimable-bonus__icon')[0]) {
            document.getElementsByClassName('claimable-bonus__icon')[0].click();
        }
    }, 5000).call(this);

    // Your code here...
})();