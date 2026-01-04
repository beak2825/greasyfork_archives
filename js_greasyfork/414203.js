// ==UserScript==
// @name         Twitch Auto Collect Points
// @namespace    https://waryor.com
// @version      0.1
// @description  Automaticly collects twitch points when watching a streamer
// @author       RustyPrimeLUX
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414203/Twitch%20Auto%20Collect%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/414203/Twitch%20Auto%20Collect%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var debug = false;
    setInterval(function(){
        if(debug)console.log("checking");
        var item = document.querySelector(".claimable-bonus__icon");
        if(item != undefined){
             item.click();
        }
        if(debug)console.log(item);
    }, 10000);
})();
