// ==UserScript==
// @name         Tiktok Downloader
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  抖音 tiktok 无水印下载脚本
// @author       You
// @match        *://*.douyin.com/video/*
// @match        *://*.tiktok.com/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463914/Tiktok%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/463914/Tiktok%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function download(url) {
  // 发送API请求
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let downloadUrl = data.aweme_list[0].video.play_addr.url_list[0];
      //打开新标签页下载
      window.open(downloadUrl);
    })
    .catch((error) => {
      alert(error);
    });
}

function addDownloadButton(element, event) {
  // 获取 data-e2e 为 "browse-copy" 的元素
  var browseCopyElement = element;
  // 创建一个新的兄弟节点
  var newNode = browseCopyElement.cloneNode(true);
  newNode.textContent = "无水印下载";
  newNode.style.marginLeft = "10px";
  newNode.addEventListener("click", event);

  // 将新节点插入到原节点后面
  browseCopyElement.parentNode.insertBefore(
    newNode,
    browseCopyElement.nextSibling
  );
}

let videoUrl = window.location.href;

if (videoUrl.includes("tiktok")) {
  let downloadUrl = `https://api.douyin.wtf/tiktok_video_data/?tiktok_video_url=${videoUrl}`;

  addDownloadButton(document.querySelector(".esk3vjb10"), () => {
    download(downloadUrl);
  });
} else if (videoUrl.includes("douyin")) {
  let downloadUrl = `https://api.douyin.wtf/douyin_video_data/?douyin_video_url=${videoUrl}`;
  addDownloadButton(document.querySelector(".Z1DFGRDj"), () => {
    download(downloadUrl);
  });
}

})();