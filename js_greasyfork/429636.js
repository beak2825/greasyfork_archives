// ==UserScript==
// @name         重庆药师网执业药师继续教育 切窗不停
// @version      1.0
// @description  避免切换到其他窗口时,视频播放停止
// @match        http://www.cqlpa.com/*
// @grant        none
// @namespace www.31ho.com
// @downloadURL https://update.greasyfork.org/scripts/429636/%E9%87%8D%E5%BA%86%E8%8D%AF%E5%B8%88%E7%BD%91%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E5%88%87%E7%AA%97%E4%B8%8D%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/429636/%E9%87%8D%E5%BA%86%E8%8D%AF%E5%B8%88%E7%BD%91%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%20%E5%88%87%E7%AA%97%E4%B8%8D%E5%81%9C.meta.js
// ==/UserScript==
 
window.onload = function () {
  setInterval(() => {
    try {
      var hre = location.href;
      if (hre.includes("http://www.cqlpa.com/zhiyeyaoshi") || hre.includes("http://www.cqlpa.com/index")) {
        window.onblur = function () {};
      }
    } catch (error) {}
  }, 1000);
};