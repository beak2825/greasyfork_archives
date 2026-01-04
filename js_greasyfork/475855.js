// ==UserScript==
// @name         哔哩哔哩跳转搜索
// @namespace    https://www.zhuiju.la/
// @version      0.3
// @description  追剧啦是一个影视资源网站。安装脚本后在番剧综艺等视频播放页左上角会显示一键搜索的按钮，点击就可以搜索影视资源了。
// @author       zy668
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475855/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B7%B3%E8%BD%AC%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475855/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B7%B3%E8%BD%AC%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";
let metaTag = document.querySelector('meta[property="og:title"]');
let content = metaTag.getAttribute('content');
    content = content.split(' ')[0];
    content = content.split('：')[0];
    content = content.replace(/[0-9]/g, '');
  let but = document.createElement("button");
  but.innerText = "一键搜索";
  but.style.cursor = "pointer";
  but.style.position = "absolute";
  but.style.left = "0px";
  but.style.top = "70px";
  but.addEventListener("click", function () {
    let url =
      "https://www.zhuiju.la/vodsearch/-------------.html?wd=" +
      encodeURIComponent(content);
    window.location.href = url;
  });
  document.body.appendChild(but);
})();