// ==UserScript==
// @name         知乎下载助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键下载知乎原图，每张图片左下角有一个下载原图按钮
// @author       Robert-Stackflow
// @match        *://*.zhihu.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499679/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/499679/%E7%9F%A5%E4%B9%8E%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var $ = $ || window.$; //获得jquery的$标识符
const window_url = window.location.href;
const window_host = window.location.host;
(function () {
  "use strict";
  window.getFileName = (url) => {
    var list = url.split("/");
    return list[list.length - 1];
  };
  window.downloadImage = (url) => {
    const x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = "blob";
    x.onload = function (e) {
      const url = window.URL.createObjectURL(x.response);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = getFileName(url);
      a.click();
      a.remove();
    };
    x.send();
  };
  if (window_url.indexOf("zhihu.com") != -1) {
    $("body").append(
      "<style>.pic-div{position: relative;}.V5NKm5Fdiqhmnxlq6ndg0g=={display:none !important;}.download-button{backdrop-filter: saturate(180%) blur(20px);background:rgba(222, 222, 222, 0.3);border-radius: 50px;padding:7px;display: inline-block;position: absolute;bottom:12px;font-size: 12px;color:#fff;left:12px;}</style>"
    );
    setInterval(function () {
      $(".RichContent-inner img").each(function () {
        var token = $(this).attr("data-original-token");
        $(this).attr("src", "https://pic1.zhimg.com/" + token + ".png");
      });
      $(".RichContent-inner img").each(function () {
        var parentDom = $(this).parent();
        parentDom.css("position", "relative");
        var downloadButtonDom = parentDom.find(".download-button");
        if (downloadButtonDom.length == 0) {
          var originUrl = parentDom.find("img").attr("src");
          var dom = $(
            `<a class="download-button" href="javascript:void(0)">下载原图</span>`
          );
          dom.click(function () {
            downloadImage(originUrl);
          });
          parentDom.append(dom);
        }
      });
    }, 100);
  }
})();
