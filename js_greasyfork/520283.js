// ==UserScript==
// @name         天猫图片下载
// @namespace    http://tampermonkey.net/
// @version      2024-12-08
// @description  天猫商品图片下载
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        GM_download
// @include      https://detail.tmall.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/520283/%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520283/%E5%A4%A9%E7%8C%AB%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const PARENT_CLASSNAME_MATCH = /^picGallery--/;
  function matchByClassname(divs, match) {
    return divs.filter(div => match.test(div.className));
  }
  function createDownloadButton() {
    const downloadButton = document.createElement('button');
    downloadButton.innerText = '下载';
    return downloadButton;
  }
  let interval = setInterval(function () {
    // 找到所有div
    const divs = Array.from(document.querySelectorAll('div'));
    if (divs.length) {
      clearInterval(interval);
      const parentDiv = matchByClassname(divs, PARENT_CLASSNAME_MATCH)[0];
      const thumbnails = parentDiv.querySelectorAll('ul li img');
      const urls = Array.from(thumbnails).map(thumbnail => thumbnail.src);
      //创建下载按钮
      const button = createDownloadButton();
      button.onclick = function () {
        // 批量下载urls
        urls.forEach((url, index) => {
            const urlList = url.split('.');
            const suffix = urlList[urlList.length - 1];
            GM_download(url, `image-${index}.${suffix}`);
        });
      };
        //插入下载按钮
      parentDiv.appendChild(button);
    }
  }, 1500);
})();

