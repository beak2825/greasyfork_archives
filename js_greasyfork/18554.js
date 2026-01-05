// ==UserScript==
// @name        player play
// @namespace   manobastardo
// @description flvplayer play
// @include     http://vidzi.tv/*
// @include     http://filenuke.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18554/player%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/18554/player%20play.meta.js
// ==/UserScript==

function get_player(player) {
    if (typeof(jwplayer) === typeof(Function)) {
        return jwplayer();
    }
    
    return $(player)[0];
}

var player = get_player("#flvplayer");
var states = ["IDLE", "PAUSED"]

function check_play () {
    player.play();
    var state = player.getState();

    if (typeof state !== "string" || states.indexOf(state) > -1) {
        setTimeout(check_play, 333);
    } 
}

if (typeof player !== "undefined") {
    check_play();
} 