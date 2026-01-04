// ==UserScript==
// @name         Webinar Download
// @namespace    https://greasyfork.org/users/305651
// @version      1.0
// @description  Downloadlink hinzufügen
// @author       Ralf Beckebans
// @match        https://register.gotowebinar.com/recording/viewRecording/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421239/Webinar%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/421239/Webinar%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function webinar_download() {


        // Video gefunden
        function video_gefunden() {
            var video = document.getElementsByClassName('jw-video')[0];
            if(video.src.substr(0, 43) == 'https://cdn.recordingassets.logmeininc.com/') {
                var downloadlink = document.getElementById('downloadlink');
                if(!downloadlink) {
                    document.getElementById('content').innerHTML += '<div style="text-align: center;"><a href="' + video.src + '" id="downloadlink">Download</a></div>';
                }
            }
        }


        // EventListener
        document.body.addEventListener('mousemove', video_gefunden, false);

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        webinar_download();
    } else {
        document.addEventListener('DOMContentLoaded', webinar_download, false);
    }

})();