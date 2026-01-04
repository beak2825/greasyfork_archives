// ==UserScript==
// @name         视频信息统计
// @namespace    http://yourwebsite.com
// @version      0.2
// @description  Check important information of the playing video on any website by right-clicking on it.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491385/%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/491385/%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check video information
    function checkVideoInformation(video) {
        // Retrieve information about the video
        var information = {
            src: video.currentSrc,
            resolution: video.videoWidth + 'x' + video.videoHeight,
            bitrate: video.bitrate || 'Not Available',
            framerate: video.webkitDecodedFrameCount / video.currentTime || 'Not Available',
            duration: video.duration || 'Not Available'
        };

        // Display the information in an alert dialog
        alert('Video Source: ' + information.src + '\nResolution: ' + information.resolution + '\nBitrate: ' + information.bitrate + '\nFramerate: ' + information.framerate.toFixed(2) + ' fps' + '\nDuration: ' + information.duration.toFixed(2) + ' seconds');
    }

    // Add event listener to all video elements for the contextmenu event
    document.addEventListener('contextmenu', function(e) {
        var video = e.target.closest('video');
        if (video) {
            e.preventDefault();
            checkVideoInformation(video);
        }
    }, false);

})();
