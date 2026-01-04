// ==UserScript==
// @name        🔥🔥2024年最新贵州省专业技术人员继续教育自动倍速刷课时脚本|静音播放|自动跳过已完成的视频|解除防挂机提示|稳定极高
// @namespace   🔥🔥自动静音播放并在播放完成后自动切换到下一个视频，直至刷完课程，减少繁琐的手动操作。
// @match       *://*.gzjxjy.gzsrs.cn/*
// @version     3.4
// @description 全新的继续教育自动刷课时脚本
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494638/%F0%9F%94%A5%F0%9F%94%A52024%E5%B9%B4%E6%9C%80%E6%96%B0%E8%B4%B5%E5%B7%9E%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE%E6%97%B6%E8%84%9A%E6%9C%AC%7C%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E8%A7%86%E9%A2%91%7C%E8%A7%A3%E9%99%A4%E9%98%B2%E6%8C%82%E6%9C%BA%E6%8F%90%E7%A4%BA%7C%E7%A8%B3%E5%AE%9A%E6%9E%81%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/494638/%F0%9F%94%A5%F0%9F%94%A52024%E5%B9%B4%E6%9C%80%E6%96%B0%E8%B4%B5%E5%B7%9E%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE%E6%97%B6%E8%84%9A%E6%9C%AC%7C%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E8%A7%86%E9%A2%91%7C%E8%A7%A3%E9%99%A4%E9%98%B2%E6%8C%82%E6%9C%BA%E6%8F%90%E7%A4%BA%7C%E7%A8%B3%E5%AE%9A%E6%9E%81%E9%AB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoIndex = 0;  // current video index

    function playNextVideo() {
        // Find all video title elements on the page
        let videoTitles = document.querySelectorAll('.step-title');
        if (videoTitles.length > 0 && videoIndex < videoTitles.length) {
            var parentDiv = videoTitles[videoIndex].parentNode
            //console.log(parentDiv)
            var isFinish = parentDiv.querySelector('.status-tip')
            //console.log(isFinish)
            console.log(videoTitles[videoIndex].innerText)

            videoIndex += 1;
            
            // 跳过已完成
            if (null != isFinish) {
                playNextVideo();
            } else {
                // Click the video title to start the video
                videoTitles[videoIndex].click();

                // Timeout is added here to ensure that video has enough time to load
                setTimeout(function() {
                    // Find the video element and attach the 'ended' event listener
                    let videos = document.getElementsByTagName('video');
                    for (let i = 0; i < videos.length; i++) {
                        videos[i].playbackRate = 4; // Play video at 8x speed
                        videos[i].onended = function() {
                            //videoIndex += 1;
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

    observer.observe(document, { childList: true, subtree: true });

    // Start playing videos as soon as the page loads
    setTimeout(playNextVideo, 2000); // Delay 2 seconds before playing

    // 清除防挂机检测
    setInterval(function () {
        //console.log("按钮检测")
        var button = document.querySelector("body > div.el-dialog__wrapper > div > div.el-dialog__footer > span > button");
        //console.log(button)
        if (null != button) {
            console.log("点击了按钮")
            button.click();
        }
    }, 5000)
})();