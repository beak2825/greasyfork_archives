// ==UserScript==
// @name     Auto Challenge for the Crest Challenge
// @description Automatically clicks the link/button to challenge a player in the crest challenge
// @version 1.2.1.2
// @include https://*/game.php?village=*&screen=event_crest*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40130/Auto%20Challenge%20for%20the%20Crest%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/40130/Auto%20Challenge%20for%20the%20Crest%20Challenge.meta.js
// ==/UserScript==
setInterval(function challengeAuto(){
    "use strict";
    for(var i = 0;i < 7;i++){
        var but = $("#challenge_table").children().eq(1).children().eq(i).children().eq(3).children();
        var first = $("#challenge_table").children().eq(1).children().children().eq(3);
        if(first.attr('href')){
            window.location = but.attr("href");
        }
        else if(but.attr('href')){
            window.location = but.attr("href");
        }
    }
},3000);