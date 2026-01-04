// ==UserScript==
// @name         视频信息查看

// @namespace    http://yourwebsite.com
// @version      0.1
// @description  Check important information of the playing video on any website.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491386/%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491386/%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B.meta.js
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

    // Check for video elements on the page every second
    setInterval(function() {
        var videos = document.querySelectorAll('video');
        if(videos.length > 0) {
            videos.forEach(function(video) {
                if(video.readyState === 4 && !video.paused) {
                    if(!video.hasAttribute('data-information-checked')) {
                        video.setAttribute('data-information-checked', 'true');
                        var button = document.createElement('button');
                        button.textContent = 'Video Information';
                        button.style.position = 'fixed';
                        button.style.top = '10px';
                        button.style.right = '10px';
                        button.style.zIndex = '9999';
                        button.addEventListener('click', function() {
                            checkVideoInformation(video);
                        });
                        document.body.appendChild(button);
                    }
                }
            });
        }
    }, 1000);

})();