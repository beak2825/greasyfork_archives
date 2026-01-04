// ==UserScript==
// @name Bypass Hulu Ads
// @version 1.2
// @description This script automatically skips through Hulu's ads.
// @author Oxygen6#3552
// @match *://www.hulu.com/watch/*
// @namespace https://greasyfork.org/users/416701
// @downloadURL https://update.greasyfork.org/scripts/428569/Bypass%20Hulu%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/428569/Bypass%20Hulu%20Ads.meta.js
// ==/UserScript==
doit();
function doit() {
    var player = document.querySelector('div[id^="__player__"]');
    if (player == null) doit();
    else {
        var get = player.querySelector,
            adPlayr;
        var adPlayer = get('video[class^="video-player ad-video-player"]');
        var adPlayer1 = get('video[class^="AdPlayer__video vsc-initialized"]');
        var adPlayer2 = get('video[class^="AdPlayer__video"]');
        if (adPlayer != null) adPlayr = adPlayer;
        else if (adPlayer1 != null) adPlayer = adPlayer1;
        else if (adPlayer2 != null) adPlayer = adPlayer2;
        adPlayer.playbackRate = 16.0;
        adPlayer.muted = true;
    }
    doit();
}