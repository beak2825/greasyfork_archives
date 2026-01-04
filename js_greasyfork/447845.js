// ==UserScript==
// @name         开课吧视频下载
// @namespace    https://juejin.cn/user/1063982988277565
// @version      0.1
// @description  获取开课吧视频链接自动跳转m3u8下载   
// @author       mzt
// @match        https://*.kaikeba.com/*
// @require  https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.j
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447845/%E5%BC%80%E8%AF%BE%E5%90%A7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447845/%E5%BC%80%E8%AF%BE%E5%90%A7%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
window.onload = function () {
  if (!window.performance && !window.performance.getEntries) {
    return false;
  }
  var result = "";
  var videoUrl = []
  setTimeout(() => {
    let arr = window.performance.getEntries();
    arr.forEach((item, index) => {
      if (
        item.initiatorType === "xmlhttprequest" ||
        item.initiatorType === "fetch"
      ) {
        if (item.name.indexOf("detail") > -1) {
          result = arr[index].name;
        }
      }
    });
    $.ajax({
        type: "GET",
        url: result,
        data: "",
        dataType: "json",
        success: function (res) {
            videoUrl = res.data.mediaMetaInfo.videoGroup
            console.log('视频链接',videoUrl[0].playURL)
            window.open('https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source='+videoUrl[0].playURL)
        }
    });
  }, 1000);
};
