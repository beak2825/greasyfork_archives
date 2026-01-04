// ==UserScript==
// @name         IdleScape Idle Notification
// @namespace    D4IS
// @version      0.2
// @description  Plays a sound when you're idling in Idlescape
// @author       D4M4G3X
// @match        http*://*idlescape.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420330/IdleScape%20Idle%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/420330/IdleScape%20Idle%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkExist = setInterval(function() {
        var status = document.getElementsByClassName("status-action")[0].innerHTML
        if (~status.toLowerCase().indexOf('idling')) {
            var audio = new Audio('https://soundbible.com//mp3/dixie-horn_daniel-simion.mp3'); // Edit sound here
            audio.play();
        }
    }, 10000);
})();