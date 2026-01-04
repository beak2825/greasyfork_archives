// ==UserScript==
// @name 南方医科大学爱课平台自动二倍速静音播放全部视频/Auto Aike 2x Speed Muted Video Player
// @namespace https://aike.smu.edu.cn/
// @version 2.0
// @description Automatically play videos at 2x speed and mute on Aike；add a switch for checking specific texts
// @author Lily Yu
// @match https://aike.smu.edu.cn/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462074/%E5%8D%97%E6%96%B9%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%88%B1%E8%AF%BE%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%E5%85%A8%E9%83%A8%E8%A7%86%E9%A2%91Auto%20Aike%202x%20Speed%20Muted%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/462074/%E5%8D%97%E6%96%B9%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%88%B1%E8%AF%BE%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%E5%85%A8%E9%83%A8%E8%A7%86%E9%A2%91Auto%20Aike%202x%20Speed%20Muted%20Video%20Player.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add a switch for checking specific texts
  const checkText = true;

  // Define the elements to be manipulated
  var videos, nextPageButton;

  // Wait for the window to load completely
  window.onload = function () {
    // Find all the video elements on the page
    videos = document.querySelectorAll('video');

    // Find the next page button on the page
    nextPageButton = document.querySelector('#next-activity-link');

    function processVideos() {
      // Check if there are any videos on the page
      if (videos.length === 0) {
        // No videos, just click the next page button
        nextPageButton.click();
      } else {
        // Loop through all the video elements
        for (var i = 0; i < videos.length; i++) {
          // Get the current video element
          var video = videos[i];

          // Play the video at 2x speed and mute
          video.playbackRate = 2;
          video.muted = true;
          video.play();

          // Add an event listener to the video element to detect when it ends
          video.addEventListener('ended', function () {
            // Click the next page button to load a new video
            nextPageButton.click();
          });
        }
      }
    }

    // Check if either of the specific texts is present on the page
    if (checkText) {
      const targetTexts = [
        '授课视频，同学需浏览完视频，爱课平台才记录为完成学习任务。',
        '此内容为线上授课，同学们需浏览完视频，爱课平台才会记录为完成学习任务。',
      ];
      const targetElement = document.querySelector('#resourceintro p span');
      if (targetElement && targetTexts.some(text => targetElement.innerText === text)) {
        processVideos();
      } else {
        nextPageButton.click();
      }
    } else {
      processVideos();
    }
  };
})();
