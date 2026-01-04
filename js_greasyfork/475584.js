// ==UserScript==
// @name        youtube-create-sorted-playlist-related-channnels-when-clicked
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 2023/9/18 17:09:04
// @require     https://code.jquery.com/jquery-1.12.4.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475584/youtube-create-sorted-playlist-related-channnels-when-clicked.user.js
// @updateURL https://update.greasyfork.org/scripts/475584/youtube-create-sorted-playlist-related-channnels-when-clicked.meta.js
// ==/UserScript==
var enable_flag = true; // until page reload
var str_enablebtn_txt = "#auto create channnel's playlist: ";

var func_tmp01 = function(str_link) {
	str_link+= "&list=UL01234567890";
	document.location = str_link;
};
document.addEventListener('yt-navigate-finish', () => {
    // enable / disable btn
    var place = $(document).find("ytd-playlist-panel-renderer > div:nth-child(1), yt-chip-cloud-renderer > div:nth-child(1), body > yt-live-chat-app");
    var enable_btn = $('<span class="ycsprcwc_btn01" style="display: inline-block; padding: .25em .5em; color:#FFF; font-size: 1.5em; background: #333; border: 2px dotted #FFF; border-radius: .35em; text-decoration: underline; cursor: pointer;">'+str_enablebtn_txt+((enable_flag)?"on":"off")+'</span>');
    if ($('body .ycsprcwc_btn01:visible').length < 1) {
        place.prepend(enable_btn);
    }
    // Check URL
    var str_link = String(window.location.href);
    if (/\&list\=/.test(str_link)) { return; }
    if (/watch\?v\=/.test(str_link)) {
        if (enable_flag) {
            func_tmp01(str_link);
        }
    }
});
$(document).on("click", ".ycsprcwc_btn01", (e) => {
    if (enable_flag) {
        enable_flag = false;
    } else {
        enable_flag = true;
    }
    $('.ycsprcwc_btn01').text(str_enablebtn_txt+((enable_flag)?"on":"off"));
});