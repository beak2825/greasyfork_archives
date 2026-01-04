// ==UserScript==
// @name        用滾輪調播放速度 - anime1.me
// @namespace   Violentmonkey Scripts
// @match       https://anime1.me/*
// @grant       none
// @version     1.0
// @author      bigiCrab
// @description 2022/4/10 下午11:03:14
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/443395/%E7%94%A8%E6%BB%BE%E8%BC%AA%E8%AA%BF%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%20-%20anime1me.user.js
// @updateURL https://update.greasyfork.org/scripts/443395/%E7%94%A8%E6%BB%BE%E8%BC%AA%E8%AA%BF%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%20-%20anime1me.meta.js
// ==/UserScript==

const jSpeedBTN = $("div.vjs-playback-rate")
const speedStap = 0.1
    
function getCurrentSpeed(videoEle){
  return videoEle.playbackRate
}

jSpeedBTN.on("wheel", (event) => {
  event.preventDefault();
  event.stopPropagation();
  let videoEle = $(event.currentTarget).parent().parent().children("video").get(0)
  handleWheelEventPlaybackRate(event,videoEle);
});

function handleWheelEventPlaybackRate(event,videoEle) {
  let speedVector = event.originalEvent.deltaY < 0 ? 1 : -1;
  let calcSpeed = Math.round((getCurrentSpeed(videoEle) + speedVector * speedStap) * 100) / 100;
  videoEle.playbackRate = Math.min(Math.max(0, calcSpeed), 16);
}