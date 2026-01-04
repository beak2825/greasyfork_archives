// ==UserScript==
// @name         動畫瘋鍵盤快捷鍵
// @version      0.0.1
// @description  使用鍵盤快捷鍵觀賞動畫瘋
// @author       windicevista
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @namespace https://greasyfork.org/users/579627
// @downloadURL https://update.greasyfork.org/scripts/478001/%E5%8B%95%E7%95%AB%E7%98%8B%E9%8D%B5%E7%9B%A4%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/478001/%E5%8B%95%E7%95%AB%E7%98%8B%E9%8D%B5%E7%9B%A4%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==


document.addEventListener('keydown', function (event) {
  // K鍵播放/暫停
  if (event.key === 'k' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    togglePlayVideo();
  }
  // M鍵靜音
  if (event.key === 'm' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    toggleMute();
  }
  // F鍵全螢幕
  if (event.key === 'f' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault(); // 阻止浏览器默认行为
    toggleFullScreen();
  }
  // SHIFT鍵+>加速和SHIFT鍵+<减速
  if (event.shiftKey) {
    if (event.key === '>') {
      changeSpeedRate(0.25); // 加速播放速度
    } else if (event.key === '<') {
      changeSpeedRate(-0.25); // 减速播放速度
    }
  }
});

function togglePlayVideo() {
  // 播放/暫停
  const video = document.querySelector('video');
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
// 開啟/關閉靜音
function toggleMute() {
  const video = document.querySelector('video');
  video.muted = !video.muted;
}
// 加速/減速
function changeSpeedRate(speedChange) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate += speedChange;
    // 限制最大速度为2
    if (video.playbackRate > 2) {
      video.playbackRate = 2;
    }
    // 限制最小速度为0.25
    if (video.playbackRate < 0.25) {
      video.playbackRate = 0.25;
    }
  }
}
// 開啟/關閉全螢幕
function toggleFullScreen() {
  const video = document.querySelector('video');
  if (video) {
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}


