// ==UserScript==
// @name         Xiaohongshu Assistant
// @namespace    https://www.xiaohongshu.com/
// @version      0.1.0
// @description  小红书助手：自动取消视频静音
// @author       muggledy
// @match        https://www.xiaohongshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/525365/Xiaohongshu%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/525365/Xiaohongshu%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var video_obj = null;
  var playButton = null;
  var muteButton = null;
    // 定义定时器
  const checkMuteButton = setInterval(() => {
    // 尝试获取 muteButton 元素
    //video_obj = document.getElementsByTagName('video')[0];
    playButton = document.querySelector('.xgplayer-icon-play');
    muteButton = document.querySelector('.xgplayer-icon-muted');

    // 如果 muteButton 存在，则停止定时器并继续后续操作
    if (/*video_obj && */muteButton && playButton) {
      //console.log('Video obj found:', video_obj);
      console.log('Play button found:', playButton);
      console.log('Mute button found:', muteButton);
      clearInterval(checkMuteButton); // 停止定时器

      setTimeout(() => {
          if (playButton) {
              console.log('click play button');
              playButton.click();
              setTimeout(() => {
                  if (muteButton) {
                      console.log('click mute button');
                      muteButton.click();
                  }
              }, 1000);
          }
      }, 3000);

    }
  }, 100); // 每 100 毫秒检查一次，直到元素被找到

    // Your code here...
})();