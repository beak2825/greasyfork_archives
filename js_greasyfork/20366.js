// ==UserScript==
// @name         Youtube Downloader
// @namespace    pxgamer
// @version      0.4.1
// @description  Allows you to download videos off YouTube. (Yet another one...)
// @author       pxgamer
// @include      *youtube.com/watch?v=*
// @require      https://code.jquery.com/jquery-1.12.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20366/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/20366/Youtube%20Downloader.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    $('#watch8-secondary-actions').prepend('<div class="yt-uix-menu dlmp3"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay yt-uix-menu-trigger yt-uix-tooltip" type="button" role="button" aria-pressed="false" title="Download as MP3" aria-haspopup="true" data-tooltip-text="Download as MP3" aria-labelledby="yt-uix-tooltip2707-arialabel"><span><img style="width: 20px; height: 20px;" src="https://pximg.xyz/images/a80307fb3e74a1c17694454617d1560d.png"></span><span class="yt-uix-button-content">Download as MP3</span></button></div>');

    $('.dlmp3').on('click', function() {
        let url = 'https://www.youtubeinmp3.com/fetch/?format=JSON&video=' + location.href;
        $.ajax({
            method: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                location.href = data.link;
            }
        });
    });

})();
