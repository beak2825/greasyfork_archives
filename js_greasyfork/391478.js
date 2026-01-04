// ==UserScript==
// @name         Twitch Auto Reward
// @namespace    https://www.twitch.tv/
// @version      14.88
// @description  xqcL
// @author       Khenio & iErcan
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391478/Twitch%20Auto%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/391478/Twitch%20Auto%20Reward.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 function random(min, max) {
     return Math.floor(Math.random() * (max - min)) + min;
 }
 
 
 setInterval(function() {
     var url = window.location.href; // actual url
     document.getElementsByClassName("tw-button tw-button--success tw-interactive")[0].click(); // Click the button
 
 }, 10000);
})();