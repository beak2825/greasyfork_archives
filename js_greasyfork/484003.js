// ==UserScript==
// @name         youtube shorts full screen
// @name:zh-CN   youtube shorts full screen
// @name:en      youtube shorts full screen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  fキーを押すことによってshortsでも全画面表示にできます
// @description:zh-cn 按 f 键还可以在短片中全屏显示。
// @description:en    You can also go full screen in shorts by pressing the f key
// @author       You
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484003/youtube%20shorts%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/484003/youtube%20shorts%20full%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';
// ビデオ要素を取得します
var videoElement = document.querySelector('video');

// キーボードのイベントリスナーを追加します
document.addEventListener('keydown', function(event) {
  // Fキーが押されたとき
  if (event.key === 'f' || event.key === 'F') {
    // ビデオが全画面表示されているかどうかをチェックします
    if (document.fullscreenElement) {
      // 全画面表示を終了します
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } else {
      // ビデオ要素を全画面表示にします
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) { // Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) { // IE/Edge
        videoElement.msRequestFullscreen();
      }
    }
  }
});



})();