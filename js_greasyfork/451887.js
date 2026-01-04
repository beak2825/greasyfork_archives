// ==UserScript==
// @name         WebAceDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for web-ace.jp
// @icon         https://web-ace.jp/img/pc/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451887-webacedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://web-ace.jp/*/contents/*/episode/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451887/WebAceDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451887/WebAceDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get url of images and title
  const urls = await axios.get(window.location.href + 'json').then(res => res.data.map(path => 'https://web-ace.jp' + path));
  const title = document.title.split('｜')[0];

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title,
    positionOptions: { top: '260px' }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => axios.get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);