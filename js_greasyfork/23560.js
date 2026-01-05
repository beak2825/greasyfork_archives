// ==UserScript==
// @name         [YouTube.com] youtube-dl-php - Download Button
// @namespace    PXgamer
// @version      0.2
// @description  For use with: https://github.com/PXgamer/youtube-dl-php
// @author       PXgamer
// @include      *youtube.com/watch?v=*
// @include      *www.youtube.com/watch?v=*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23560/%5BYouTubecom%5D%20youtube-dl-php%20-%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/23560/%5BYouTubecom%5D%20youtube-dl-php%20-%20Download%20Button.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var searchGET = '/youtube-dl-php/tests/$_GET.test.php'; // Your path to GET based implementation (i.e. /tests/$_GET.test.php)

    var vid_id = location.href.split('watch?v=')[1].split('&')[0];

    $('#watch8-secondary-actions').append('<div class="yt-uix-menu"><a target="_blank" href="'+searchGET+'?vid_id='+vid_id+'"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity"><span class="yt-uix-button-content">Download/Parse Video</span></button></a></div>');
})();
