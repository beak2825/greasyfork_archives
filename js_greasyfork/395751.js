// ==UserScript==
// @name         Twitch auto-claim
// @version      0.1
// @description  Auto claim twitch bonus chests
// @author       ArrowVulcan
// @match        https://www.twitch.tv/*
// @namespace https://greasyfork.org/users/183198
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395751/Twitch%20auto-claim.user.js
// @updateURL https://update.greasyfork.org/scripts/395751/Twitch%20auto-claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){ document.querySelector(".claimable-bonus__icon").parentElement.parentElement.click(); }, 5000);
    
})();