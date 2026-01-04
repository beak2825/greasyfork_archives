// ==UserScript==
// @name         清除视频马赛克
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除视频中的马赛克
// @author       You
// @match        https://missav.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531651/%E6%B8%85%E9%99%A4%E8%A7%86%E9%A2%91%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531651/%E6%B8%85%E9%99%A4%E8%A7%86%E9%A2%91%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==
// @license           MIT
(function() {
  'use strict';
  var video = document.querySelector('video');
  if (video) {
    // 获取视频的canvas元素
    var canvas = document.querySelector('canvas');
    if (canvas) {
      // 清除canvas中的马赛克
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // 获取视频的svg元素
    var svg = document.querySelector('svg');
    if (svg) {
      // 清除svg中的马赛克
      svg.innerHTML = '';
    }
    // 使用video.js库来控制视频播放
    var player = videojs(video);
    player.on('play', function() {
      // 清除视频中的马赛克
      var videoCanvas = document.querySelector('video canvas');
      if (videoCanvas) {
        var ctx = videoCanvas.getContext('2d');
        ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
      }
    });
  }
  // 自动调用canvas和svg来实现清除视频中马赛克
  setInterval(function() {
    var video = document.querySelector('video');
    if (video) {
      var canvas = document.querySelector('canvas');
      if (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      var svg = document.querySelector('svg');
      if (svg) {
        svg.innerHTML = '';
      }
    }
  }, 1000);
})();