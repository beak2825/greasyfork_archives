// ==UserScript==
// @name         b站大会员广告
// @namespace    wrongThing
// @version      0.2
// @description  b站大会员广告清除
// @author       wrongThing
// @match        *.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431888/b%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/431888/b%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var maxCheckTime = 5 * 60 * 60;
  var startTime = +new Date();
  var endTime = startTime + maxCheckTime;
  var timer = null;
  var count = 0;

  var e = document.createEvent("MouseEvents")
  e.initEvent('click', true, true);

  function clearTimer() {
    timer && clearInterval(timer);
    timer = null;
  }
  function controlAd() {
    count++;
    console.log(`【b站大会员弹窗广告检测】：第${count}次检测`)
    if (+new Date() >= endTime) {
      clearTimer();
      console.log(`【b站大会员弹窗广告检测】：超时退出`)
      return;
    }
    const closeButton = document.querySelector('.bili-dialog-m .q1080p .icon.close');
    if (closeButton) {
      // adDialog.parentNode.removeChild(adDialog);
      closeButton.dispatchEvent(e);
      const video = document.querySelector('video');
      video && video.play();
      clearTimer();
      console.log(`【b站大会员弹窗广告检测】：成功清除`)
    }
  }
  timer = setInterval(controlAd, 200)
  // Your code here...
})();