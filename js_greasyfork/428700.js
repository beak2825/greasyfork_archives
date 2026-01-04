// ==UserScript==
// @name         抖音视频去水印下载
// @namespace    https://github.com/hzlzh
// @version      1.0.0
// @description  下载没有水印的抖音视频(douyin.com)
// @author       hzlzh
// @include      https://www.douyin.com/video/*
// @grant GM_download
// @downloadURL https://update.greasyfork.org/scripts/428700/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/428700/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

const videoID = location.href.match(/video\/(\d*)/)[1];
fetch("https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + videoID)
  .then((res) => res.json())
  .then((json) => {
    const videoLink = json.item_list[0].video.play_addr.url_list[0].replace("playwm", "play");
    const btn = document.createElement("a");
    btn.textContent = '去水印下载';
    btn.href = videoLink;
    btn.target = '_blank'
    btn.style.position = 'fixed'
    btn.style.zIndex = '9999'
    btn.style.left = '8px'
    btn.style.top = '80px'
    btn.style.opacity = '0.8'
    btn.style.padding = '4px 8px'
    btn.style.color = '#ffffff'
    btn.style.background = '#fe2c55'
    document.body.appendChild(btn);
  });