// ==UserScript==
// @name         Twith Bot
// @namespace    http://tampermonkey.net/
// @description  Twith Bot for collect points
// @author       EnterBrain
// @match        https://www.twitch.tv/*
// @require       https://code.jquery.com/jquery.js
// @grant        none
// @version 0.0.1.20210518152832
// @downloadURL https://update.greasyfork.org/scripts/400185/Twith%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/400185/Twith%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let timerId = setTimeout(function tick() {
        if($(".community-points-summary").length > 0){
            if ($(".community-points-summary > div:eq(1) button").length > 0){
                $(".community-points-summary > div:eq(1) button").trigger( "click" );
            }
        }
        timerId = setTimeout(tick, 10000); // (*)
    }, 10000);
})();