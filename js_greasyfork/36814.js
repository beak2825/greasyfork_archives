// ==UserScript==
// @name         Viki Segment/Subtitle Helper
// @namespace    http://hermanfassett.me
// @version      0.1
// @description  Some improvements on the segmenter/subtitler on Viki
// @author       Herman Fassett
// @match        *://*subber.viki.com/subtitlers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36814/Viki%20SegmentSubtitle%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/36814/Viki%20SegmentSubtitle%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global vars we make use of
    let player = subbingTool.player;
    let pixelsInSecond = $("#timeframe li").width() || 30;

    // Allow click select on timeline to move time
    $("#timelines").off("click").on("click", function(event) {
        player.currentTime(player.currentTime() + (event.clientX - $(".needle").offset().left) / pixelsInSecond);
    });

    // Add keystrokes to decrease/increase speed
    $(document).on("keypress", function(e) {
        if (e.which === 91) {
            // Minus key
            player.playbackRate(player.playbackRate() - 0.1);
        } else if (e.which === 93) {
            // Plus key
            player.playbackRate(player.playbackRate() + 0.1);
        } else if (e.which === 61) {
            // 0 key
            player.playbackRate(1.0);
        }
    });
})();