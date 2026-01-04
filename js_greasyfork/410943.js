// ==UserScript==
// @name         大数乐学堂
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  try to take over the world!
// @author       Sheldon
// @match        http://dashuf.yunxuetang.cn
// @include      http://*dashuf.yunxuetang.cn/*
// @include      https://*dashuf.yunxuetang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410943/%E5%A4%A7%E6%95%B0%E4%B9%90%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/410943/%E5%A4%A7%E6%95%B0%E4%B9%90%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
    let tab = 0; // 窗口的数量
  setInterval(function() {
    // 父页面代码
    let lessonList = document.querySelectorAll('span.text-link.hand');
    let list = Array.from(lessonList).filter(item => item.innerText === '立即学习');
    if (list.length > 0 && tab === 0) {
      list[0].click();
      tab++;
    }
    // 子页面代码
    let progressNode = document.querySelector('#ScheduleText');
    let progress = progressNode ? progressNode.innerText : '';
    let isDone = progress === '100%';
    if (isDone) {
      window.opener.location.reload(); // 刷新父页面，重载脚本
      window.opener = null;
      window.open('', '_self');
      window.close(); // 关闭当前页
      return;
    }
    let btn = document.querySelector('#dvWarningView .btnok');
    btn && btn.click(); // 跳过防作弊
  }, 30000);
  setTimeout(function() {
    let videoEle = document.querySelector('video.vjs-tech');
    // 自动播放和自动静音
    if (videoEle) {
      // videoEle.setAttribute('muted', 'muted');
      videoEle.muted = true;
      // myVideo.volume = 0.0;
      videoEle.play();
    }
  }, 3000);
})();