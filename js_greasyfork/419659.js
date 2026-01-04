// ==UserScript==
// @name         Sub2Unlock skipper
// @namespace    KURD
// @version      0.2
// @description  bypasses sub2unlock trash security.
// @author       Corduene#6404 Discord
// @match        https://sub2unlock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419659/Sub2Unlock%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/419659/Sub2Unlock%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = document.getElementById("theGetLink").innerHTML;
    console.Log('Voila there you go!')
})();