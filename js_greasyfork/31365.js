// ==UserScript==
// @name         JWPlayer remote
// @namespace    https://rin.one/
// @version      1
// @description  JWPlayer remote for 9anime
// @author       devJason
// @match        https://9anime.to/watch/*
// @copyright    2017+, rin.one
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/31365/JWPlayer%20remote.user.js
// @updateURL https://update.greasyfork.org/scripts/31365/JWPlayer%20remote.meta.js
// ==/UserScript==

var state = true;
var currentpos;
var playbackstate;

$(document).keypress(function(e) {
    //If I is pressed
    if(e.which == 105 || e.which == 73) {
        switch(jwplayer().getState()){
            case "playing":
                state = true;
            break;
            case "paused":
                state = false;
            break;
            default:
        }
        jwplayer().pause(state);
    }
    //If U is pressed
    if(e.which == 117 || e.which == 85) {
        currentpos = jwplayer().getPosition();
        if(currentpos - 2 >= 0){
            jwplayer().seek(currentpos - 2);
        }else{
            jwplayer().seek(0);
        }
    }
    //If O is pressed
    if(e.which == 111 || e.which == 79) {
        currentpos = jwplayer().getPosition();
        if(currentpos + 2 <= jwplayer().getDuration()){
            jwplayer().seek(currentpos + 2);
        }else{
            jwplayer().seek(jwplayer().getDuration() - 0.5);
            jwplayer().pause(true);
        }
    }
});