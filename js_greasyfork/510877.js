// ==UserScript==
// @name         [Youtube] No UPCOMING Thumbnails
// @namespace    none
// @version      1.1.0
// @description  Youtubeの「登録チャンネル」ページにて、「配信予定」の動画・ライブを全て非表示にします
// @author       4ma9ry
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/@*
// @icon         https://www.youtube.com/s/desktop/f72ecfe9/img/favicon_32x32.png
// @grant        none
// @noframes
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510877/%5BYoutube%5D%20No%20UPCOMING%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/510877/%5BYoutube%5D%20No%20UPCOMING%20Thumbnails.meta.js
// ==/UserScript==

var $ = window.jQuery;


$(function(){
    var targets_left = 0;
    // var kills = 0;

    function count_and_remove() {
        targets_left = $('button[aria-label="通知を受け取る"]').length;

        for (var i = 0; i < targets_left; i++) {
            $('button[aria-label="通知を受け取る"]').closest('ytd-item-section-renderer').remove(); // PC、リスト表示
            $('button[aria-label="通知を受け取る"]').closest('ytd-rich-item-renderer').remove(); // PC、グリッド表示
            // kills++;
            // console.log(kills+' UPCOMING Thumbnail(s) Removed!')
        }
    };

    $(window).scroll(function(){
        count_and_remove();
    });
});