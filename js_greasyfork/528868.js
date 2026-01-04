// ==UserScript==
// @name         小马快跑
// @namespace    ttjz_xiaomakuaipao
// @version      0.1
// @description  视频倍速
// @author       tongtianjiaozhu
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528868/%E5%B0%8F%E9%A9%AC%E5%BF%AB%E8%B7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/528868/%E5%B0%8F%E9%A9%AC%E5%BF%AB%E8%B7%91.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  let video;
  let originSpeed = 1;
  function isPlaying(video) {
    return (
      video.currentTime > 0 &&
      !video.paused &&
      !video.ended &&
      video.readyState > 2
    );
  }
  function filterPlayingVideos(videos) {
    let playingVideos = [];
    for (let i = 0; i < videos.length; i++) {
      if (isPlaying(videos[i])) playingVideos.push(videos[i]);
    }
    return playingVideos;
  }
  function findPlayingVideos(ele) {
    let videos = ele.getElementsByTagName("video");
    let playingVideos = filterPlayingVideos(videos);
    if (playingVideos.length > 0) return playingVideos;
    return ele.getElementsByTagName("bwp-video");
  }
  function getPlayingVideos() {
    let videos;
    if (document.activeElement) {
      videos = findPlayingVideos(document.activeElement);
      if (videos.length > 0) return videos;
    }
    return findPlayingVideos(document);
  }
  function keyupHandle(e) {
    if (e.keyCode === 89) {
      //还原倍速
      if (video) video.playbackRate = originSpeed;
    }
    document.removeEventListener("keyup", keyupHandle);
    document.addEventListener("keydown", keydownHandle);
  }
  function keydownHandle(e) {
    if (e.keyCode === 89) {
      // Y
      //获取video，并加速
      let videos = getPlayingVideos();
      if (videos.length > 0) {
        document.addEventListener("keyup", keyupHandle);
        document.removeEventListener("keydown", keydownHandle);
        //保存原始倍速
        video = videos[0];
        originSpeed = video.playbackRate;
        //更改倍速
        video.playbackRate = 4;
      }
    }
  }
  document.addEventListener("keydown", keydownHandle);
})();
