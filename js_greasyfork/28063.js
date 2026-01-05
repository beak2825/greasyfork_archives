// ==UserScript==
// @name         You.ct8.pl download button
// @namespace    vistafan12
// @version      0.1
// @description  http://vistafan12.eu
// @author       vistafan12
// @include      *youtube.com/watch?v=*
// @include      *www.youtube.com/watch?v=*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28063/Youct8pl%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/28063/Youct8pl%20download%20button.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var searchGET = 'http://you.ct8.pl/tests/$_GET.test.php'; 

    var vid_id = location.href.split('watch?v=')[1].split('&')[0];

    $('#watch8-secondary-actions').append('<div class="yt-uix-menu"><a target="_blank" href="'+searchGET+'?vid_id='+vid_id+'"><button class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity"><span class="yt-uix-button-content">Download Video</span></button></a></div>');
})();