// ==UserScript==
// @name         Facebook Video Downloader
// @namespace    https://greasyfork.org/en/scripts/24295
// @version      0.3
// @description  download fb videos
// @author       Венцислав Атанасов
// @match        https://www.facebook.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/24295/Facebook%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/24295/Facebook%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var prefix = '"videoData":[{';
    var suffix = '}],"';

    function getFbVideos() {
        var scripts = document.getElementsByTagName('script');
        var result = [];

        for (var i = 0; i < scripts.length; ++i) {
            var txt = scripts[i].textContent;
            var pos;

            while ((pos = txt.indexOf(prefix)) !== -1) {
                txt = txt.substr(pos + prefix.length - 1);
                var endPos = txt.indexOf(suffix);

                if (endPos === -1) {
                    continue;
                }

                var videoData = txt.substr(0, endPos + 1);
                result.push(JSON.parse(videoData));
                txt = txt.substr(endPos);
            }
        }

        return result;
    }

    GM_registerMenuCommand('Download Facebook videos', function() {
        var videosData = getFbVideos();

        if (videosData.length === 0) {
            alert('Sorry, no videos found');
            return;
        }

        var win = open();

        if (win === undefined) {
            alert('Please enable popups');
            return;
        }

        win.document.open();

        videosData.forEach(function(videoData) {
            var hd = videoData.hd_src_no_ratelimit || videoData.hd_src;
            var sd = videoData.sd_src_no_ratelimit || videoData.sd_src;

            if (!hd && !sd) {
                return;
            }

            win.document.write('<video src="' + (hd || sd) + '" controls width="640"></video><br>');

            if (hd) {
                win.document.write('<a href="' + hd + '" download>Download HD quality</a> ');
            }

            if (sd) {
                win.document.write('<a href="' + sd + '" download>Download SD quality</a>');
            }

            win.document.write('<hr>');
        });

        win.document.close();
    });
})();