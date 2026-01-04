// ==UserScript==
// @name         Twitch.tv Channel Points Auto-clicker
// @namespace    http://kryogenic.org/
// @version      0.2.1
// @description  Clicks the green gift button for you
// @author       kryogenic
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393989/Twitchtv%20Channel%20Points%20Auto-clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/393989/Twitchtv%20Channel%20Points%20Auto-clicker.meta.js
// ==/UserScript==



(function() {
    setInterval(function(){
        var gift = document.getElementsByClassName('claimable-bonus__icon')[0];
        if (gift) {
            gift.click()
        }
    }, 5000)
})();