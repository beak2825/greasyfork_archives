// ==UserScript==
// @name         ComiciDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.2
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comici.jp
// @icon         https://comici.jp/images/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/478339-comicidownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comici.jp/*/episodes/*
// @match        https://cdn.comici.jp/*/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478339/ComiciDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/478339/ComiciDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  if (window.location.host === 'comici.jp') {
    const linkElement = document.createElement('a');
    linkElement.textContent = 'Please click here to download';
    linkElement.href = window.location.href.replace('comici.jp', 'cdn.comici.jp');
    linkElement.style = `
      position: fixed;
      top: 96px;
      left: 72px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 36px;
      font-size: 14px;
      font-family: 'Consolas', 'Monaco', 'Microsoft YaHei';
      color: #fff;
      background-color: #0984e3;
      border-radius: 4px;
      cursor: pointer;
    `;
    document.body.appendChild(linkElement);
    return;
  }

  // load html
  document.body.innerHTML = await axios.get(window.location.href.replace('cdn.comici.jp', 'comici.jp')).then(res => res.data);
  document.querySelector('#commnet_overlay').style.display = 'none';

  // get title and urls
  const title = document.querySelector('.article-title-box span[class*=title]').textContent.trim();
  const imageURLs = Array.from(document.querySelectorAll('.manga-area > img')).map(imgElement => imgElement.dataset.src);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => axios.get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);