// ==UserScript==
// @name         N 網漫畫下載工具
// @version      1.0
// @description  下載 nhentai 漫畫
// @author       oF
// @license      MIT
// @match        https://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        GM_download
// @grant        GM_setClipboard
// @namespace https://github.com/sky9154
// @downloadURL https://update.greasyfork.org/scripts/467814/N%20%E7%B6%B2%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/467814/N%20%E7%B6%B2%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


const downloadImage = () => {
  const thumbnailContainer = document.querySelector('#thumbnail-container');

  if (thumbnailContainer) {
    const imageList = [];

    const imgElements = thumbnailContainer.querySelectorAll('img');

    imgElements.forEach((image) => {
      let src = image.getAttribute('data-src');

      src = src.replace('t.jpg', '.jpg');
      src = src.replace('https://t', 'https://i');

      imageList.push(src);
    });

    const imageListLength = imageList.length.toString().length;

    imageList.forEach((src, index) => {
      const ext = src.split('.')[src.split('.').length - 1];

      let fileName = `${(index + 1).toString().padStart(imageListLength, '0')}.${ext}`;
      fileName = fileName.replace(/[<>|\|*|"|\/|\|:|?]/g, '_');

      GM_download(src, fileName);

    })
  }
}

const copyTitle = (title) => {
  GM_setClipboard(title.textContent);
}

(() => {
  'use strict';

  const buttons = document.querySelector('.buttons');
  const title = document.querySelector('h2.title');

  title.style.cursor = 'pointer';

  if (buttons) {
    buttons.innerHTML += '<a id="downloadImage" class="btn btn-secondary"><i class="fa fa-download"></i> 下載漫畫</a>';
  }

  const downloadImageButton = document.getElementById('downloadImage');

  downloadImageButton.onclick = downloadImage;
  title.onclick = copyTitle(title);
})();