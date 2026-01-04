// ==UserScript==
// @name        Skip Intro - 4anime.to
// @namespace   Qther
// @include     /.*\/\/4anime\.to.*episode-\d+/
// @grant       none
// @version     1.2
// @author      Qther
// @description Use J (back) and K (forward) to skip 1:30 minutes into either direction.
// @downloadURL https://update.greasyfork.org/scripts/413456/Skip%20Intro%20-%204animeto.user.js
// @updateURL https://update.greasyfork.org/scripts/413456/Skip%20Intro%20-%204animeto.meta.js
// ==/UserScript==

window.onkeydown = function(e) {
    var time = videojs.players.example_video_1.currentTime();
    switch (e.key) {
        case "j":
            time -= 90;
            break;
        case "k":
            time += 90;
            break;
        default:
            return;
    }
    videojs.players.example_video_1.currentTime(clamp(time, 0, videojs.players.example_video_1.duration()));
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}