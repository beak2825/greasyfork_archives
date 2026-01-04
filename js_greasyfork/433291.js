// ==UserScript==
// @name         好医生继续医学教育加速播放
// @version      0.1.3
// @description  非原创，如有侵权请通知删除，修改完善自Quixote Tang的脚本：好医生视频播放速度5倍
// @match             *://www.cmechina.net/*
// @match             *://cme.haoyisheng.com/*
// @grant        none
// @namespace https://greasyfork.org/users/168620
// @downloadURL https://update.greasyfork.org/scripts/433291/%E5%A5%BD%E5%8C%BB%E7%94%9F%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/433291/%E5%A5%BD%E5%8C%BB%E7%94%9F%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
 
(function () {
  setInterval(() => {
    try {
      document.querySelector("video").playbackRate = 5;
    } catch (error) {}
  }, 1000);
})();