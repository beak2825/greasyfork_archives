// ==UserScript==
// @name         91rb
// @namespace    https://greasyfork.org/en/scripts/432325
// @version      2024.8.19
// @description  91rb unlimited
// @author       You
// @include      /https?:\/\/91rb\.(com|net)\/videos\//
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.5.14/dist/hls.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432325/91rb.user.js
// @updateURL https://update.greasyfork.org/scripts/432325/91rb.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var poster = document.getElementsByClassName("no-player")[0].firstElementChild.src;
        var path = poster.match(/\/\d+(\/\d+)/);
        document.getElementsByClassName("player-holder")[0].innerHTML = '<video id="video" poster=' + poster + ' controls width="100%" height="551"></video>';
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.loadSource('https://91rbnet.douyincontent.com/hls/contents/videos' + path[0] + path[1] + '.mp4/index.m3u8');
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                hls.loadSource('https://91rbnet.douyincontent.com/hls/contents/videos' + path[0] + path[1] + '_1080p.mp4/index.m3u8');
            }
        });
        hls.attachMedia(video);

})();