// ==UserScript==
// @name       Youtube MP3 Download Button HTTPS
// @namespace  https://youtube.com
// @version    1.1.6
// @description  Adds a MP3 Download button next to the subscribe button, thanks to youtubeinmp3 for their simple download service (http://youtubeinmp3.com/api/). Based off magnus's youtube2mp3 code and Soulweaver's fork of it.
// @match         http*://www.youtube.com/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license   Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International http://creativecommons.org/licenses/by-nc-sa/4.0/
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/367997/Youtube%20MP3%20Download%20Button%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/367997/Youtube%20MP3%20Download%20Button%20HTTPS.meta.js
// ==/UserScript==
(function() {
    var proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        var pointer = this;
        var intervalId = window.setInterval(function() {
            if (pointer.readyState != 4) {
                return;
            }
            $(document).ready(function($){
                if ($('a#youtube2mp3').length === 0) {
                    window.history.pushState(document.title,'http://' + window.location.hostname + window.location.pathname + window.location.search);
                    var linkPath ='http://youtubeinmp3.com/fetch/?video='+encodeURIComponent(document.URL)+"&hq=1";
                    $(  '<a id="youtube2mp3" class="yt-uix-button yt-uix-button-default" href="'+linkPath+'" style="margin-left: 8px; height: 26px; padding: 0 22px;"><img src="http://youtubeinmp3.com/icon/download.png" style="vertical-align:middle;color: white;"> <span class="yt-uix-button-content" style="line-height: 25px; font-size: 12px;">MP3 Download</span></a>').insertAfter( "#watch7-subscription-container" );
                }
            });
            clearInterval(intervalId);
        }, 1);
        return proxied.apply(this, [].slice.call(arguments));
    };
})();