// ==UserScript==
// @name         视频长按D多倍速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  YoutTube等视频网站长按2倍速
// @author       Aoki
// @match       *://www.youtube.com/*
// @match       *://cn.pornhub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473386/%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89D%E5%A4%9A%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/473386/%E8%A7%86%E9%A2%91%E9%95%BF%E6%8C%89D%E5%A4%9A%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==


var isDKeyPressed = false;
var videoDom;

async function Web() {
  try {
    var hostname = window.location.hostname;

    if (hostname === 'www.youtube.com') {
      let YoutubeVideo = document.querySelectorAll(".video-stream, .html5-main-video")[0];
      videoDom = YoutubeVideo;
    } else if (hostname === 'cn.pornhub.com') {
      let Pornhub = document.querySelector('.mgp_videoWrapper');
      let PornhubVideo = Pornhub.getElementsByTagName("video")[0];
      videoDom = PornhubVideo;
    }

    if (videoDom) {
      return;
    } else {
      throw new Error('Failed to get videoDom');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function handleKeyDown(event) {
  if (event.keyCode === 68 || event.keyCode === 100) {
    if (!isDKeyPressed) {
      videoDom.playbackRate = 3.5;
      isDKeyPressed = true;
    }
  }
}

function handleKeyUp(event) {
  if (event.keyCode === 68 || event.keyCode === 100) {
    videoDom.playbackRate = 1;
    isDKeyPressed = false;
  }
}

function removeEventListeners() {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('click', Web);
}

window.onload = function() {
  (async () => {
    try {
      await Web();
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    } catch (error) {
      console.error(error);
    }
  })();
  window.addEventListener('beforeunload', removeEventListeners);
};