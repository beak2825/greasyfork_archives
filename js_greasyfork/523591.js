// ==UserScript==
// @name         MissAV.ws 防止自動暫停
// @namespace    https://github.com/DonkeyBear
// @version      0.2
// @description  防止 MissAV.ws 在切換視窗視窗、標籤時自動暫停
// @author       DonkeyBear
// @match        https://missav.ws/*
// @icon         https://missav.ws/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523591/MissAVws%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/523591/MissAVws%20%E9%98%B2%E6%AD%A2%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C.meta.js
// ==/UserScript==
 
const videoPlayer = document.querySelector('video.player');
if (!videoPlayer) { return }
 
let windowIsBlurred = false;
window.onblur = () => { windowIsBlurred = true };
window.onfocus = () => { windowIsBlurred = false };
 
videoPlayer.onpause = () => {
  if (windowIsBlurred) { videoPlayer.play() }
};