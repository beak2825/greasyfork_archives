// ==UserScript==
// @name           Live Play on click (flowplayer)
// @namespace      XcomeX
// @description    Play Youtube video from flowplayer in new tab on Mouse click.
// @version        1.2
// @author         XcomeX
// @include      /^https?://.+\.zive\.cz/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2891/Live%20Play%20on%20click%20%28flowplayer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2891/Live%20Play%20on%20click%20%28flowplayer%29.meta.js
// ==/UserScript==

$('.YOUTUBE_CONTAINER').click(function(e) { 
    var data = $(this).children('.flowplayer').first().attr('data-yt');
    var link = 'http://www.youtube.com/watch?v=' + data;
    window.open(link);
});