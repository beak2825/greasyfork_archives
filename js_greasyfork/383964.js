// ==UserScript==
// @name         Remove Watched From Youtube Related Videos
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes already watched videos from related videos.
// @author       Mithaldu
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383964/Remove%20Watched%20From%20Youtube%20Related%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/383964/Remove%20Watched%20From%20Youtube%20Related%20Videos.meta.js
// ==/UserScript==

var run_count = 0;

function findwatched() {
    var progress_bar = $("ytd-thumbnail-overlay-resume-playback-renderer");
    if(!progress_bar.length) return;
    var step;
    for (step = 0; step < 5; step++) {
        var next = progress_bar.parent();
        if(!progress_bar.length) return progress_bar;
        progress_bar = next;
    }
    return progress_bar;
}

function remove_watched() {
    run_count++;
    var watched = findwatched();
    while (watched) {
        watched.remove();
        watched = findwatched();
    }
    if(run_count == 20) return;
    setTimeout(arguments.callee, 1000);
}

(function(){remove_watched()})(1000);
