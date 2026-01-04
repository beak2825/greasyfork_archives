// ==UserScript==
// @name         RawkumaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for rawkuma.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rawkuma.net
// @homepageURL  https://greasyfork.org/scripts/468157-rawkumadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://rawkuma.net/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468157/RawkumaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/468157/RawkumaDownloader.meta.js
// ==/UserScript==

(function(JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = document.title.replace(' – Rawkuma', '');

  // get url of images
  const imageElements = document.querySelectorAll('section[style*="down-round.svg"] > img');
  const imageURLs = Array.from(imageElements).map(element => element.src);
  if (imageURLs.length === 0) return;

  // add style patch
  const styleElement = document.createElement('style');
  styleElement.textContent = `#ImageDownloader-StartNumInput, #ImageDownloader-EndNumInput { color: #000 !important; }`;
  document.head.appendChild(styleElement);

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
      .map(url => getImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      )
  }

  // get promise of image
  function getImage(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

})(JSZip, saveAs, ImageDownloader);