// ==UserScript==
// @name        芳姐特供公需课
// @namespace   🔥🔥自动静音播放并在播放完成后自动切换到下一个视频，直至刷完课程，减少繁琐的手动操作。
// @match       http://www.gzjxjy.gzsrs.cn/*
// @match       https://www.gzjxjy.gzsrs.cn/*
// @version     1.2
// @description 全新的继续教育自动刷课时脚本
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470256/%E8%8A%B3%E5%A7%90%E7%89%B9%E4%BE%9B%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470256/%E8%8A%B3%E5%A7%90%E7%89%B9%E4%BE%9B%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoIndex = 0;  // current video index

    function playNextVideo() {
        // Find all video title elements on the page
        let videoTitles = document.querySelectorAll('.step-title');
        if (videoTitles.length > 0 && videoIndex < videoTitles.length) {
            // Click the video title to start the video
            videoTitles[videoIndex].click();

            // Timeout is added here to ensure that video has enough time to load
            setTimeout(function() {
                // Find the video element and attach the 'ended' event listener
                let videos = document.getElementsByTagName('video');
                for (let i = 0; i < videos.length; i++) {
                    videos[i].playbackRate = 8; // Play video at 8x speed
                    videos[i].onended = function() {
                        videoIndex += 1;
                        if (videoIndex < videoTitles.length) {
                            playNextVideo();
                        } else {
                            // All videos have been played, reset the index and start again
                            videoIndex = 0;
                            playNextVideo();
                        }
                    }
                    // If video is paused, play it
                    if (videos[i].paused) {
                        videos[i].play();
                    }
                }
            }, 2000); // Wait for 2 seconds
        }
    }

    // Observe for new videos
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var videos = document.getElementsByTagName('video');
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    video.setAttribute('autoplay', true);
                    video.setAttribute('muted', true); // Mute the video to bypass Chrome's autoplay policy
                    video.muted = true; // Mute the video

                    // Try to prevent the video from being paused when the tab is not active
                    video.addEventListener('visibilitychange', function() {
                        if (document.visibilityState === 'hidden') {
                            video.play();
                        }
                    }, false);
                }
            }
        });
    });

 vid.addEventListener("pause", async () => {
      await sleep(1000);
      var options = document.getElementsByClassName("dialog-footer");
      options.click
    });



    observer.observe(document, { childList: true, subtree: true });

    // Start playing videos as soon as the page loads
    setTimeout(playNextVideo, 2000); // Delay 2 seconds before playing

})();
