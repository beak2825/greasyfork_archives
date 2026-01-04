// ==UserScript==
// @name         Youtube Download MP3 Button
// @icon https://i.imgur.com/335cmsg.png
// @version      1.0
// @description  Youtube Video Downloader
// @author       Chriss
// @include      *youtube.com/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/384953
// @downloadURL https://update.greasyfork.org/scripts/390902/Youtube%20Download%20MP3%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/390902/Youtube%20Download%20MP3%20Button.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var searchGET = '/youtube-dl-php/tests/$_GET.test.php'; // Your path to GET based implementation (i.e. /tests/$_GET.test.php)

    var vid_id = location.href;

    $('#watch-headline-title').append('<iframe src="//www.recordmp3.co/#/watch?v='+vid_id+'&layout=button" style="width: 300px; height: 40px; border: 0px;"></iframe><noscript><a href="https://www.recordmp3.co/#/watch?v='+vid_id+'">Youtube to MP3</a></noscript>');
})();