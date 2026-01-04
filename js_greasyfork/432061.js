// ==UserScript==
// @name         HJHS_re
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include       https?://www\.hjhs10\d\.com/videos
// @require      https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432061/HJHS_re.user.js
// @updateURL https://update.greasyfork.org/scripts/432061/HJHS_re.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var poster = 'https://www.hjhs.img.manhuatsg.com/contents/videos_screenshots/'+ parseInt(video_id/1000)*1000 + '/' + video_id + '/preview.mp4.jpg';
    document.getElementById("player_container").innerHTML = '<video id="video" class="fp-engine" poster=' + poster + ' controls width="100%"></video>';
    var video = document.getElementById('video');
    var hls = new Hls();
    hls.loadSource(vid_site2 + str_src2 + '?t=' + rand_t);
    hls.attachMedia(video);
})();