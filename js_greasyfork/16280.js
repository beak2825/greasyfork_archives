// ==UserScript==
// @name        RYM Release Pages - track time align left
// @namespace   tracktime_align_left
// @description left aligns total track time in RYM release pages in glorious 60 fps
// @locale      EN
// @include     https://rateyourmusic.com/release/*
// @include     http://rateyourmusic.com/release/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16280/RYM%20Release%20Pages%20-%20track%20time%20align%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/16280/RYM%20Release%20Pages%20-%20track%20time%20align%20left.meta.js
// ==/UserScript==
$("span.tracklist_total").css("display","block");
$("span.tracklist_total").css("text-align","left");
