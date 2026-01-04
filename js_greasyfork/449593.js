// ==UserScript==
// @name         kkb下载
// @namespace    https://juejin.cn/user/1063982988277565
// @version      1.0
// @description  被kkb坑不退款自用自动跳转m3u8下载   
// @author       zlq
// @match        https://learn.kaikeba.com/video/*
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449593/kkb%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449593/kkb%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
window.onload = function () {
  if (!window.performance && !window.performance.getEntries) {
    return false;
  }
  var result = "";
  var videoUrl = []
  setTimeout(() => {
    let arr = window.performance.getEntries();
    if(!arr || arr.length === 0) {
        return false;
    }
    arr.forEach((item, index) => {
      if (
        item.initiatorType === "xmlhttprequest" ||
        item.initiatorType === "fetch"
      ) {
        if (item.name.indexOf("m3u8") > -1) {
            window.open('https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source='+item.name)
        }
      }
    });
  }, 2000);
};
