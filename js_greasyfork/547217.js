// ==UserScript==
// @name         WeloveMangaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for welovemanga.one
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @homepageURL  https://greasyfork.org/scripts/547217-welovemangadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://welovemanga.one/wlmr-*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/547217/WeloveMangaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/547217/WeloveMangaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = window.location.pathname.replace('/wlmr-', '').replace('.html', '');

  // get url of images
  const imageURLs = await fetch(window.location.href)
    .then(res => res.text())
    .then(html => (new DOMParser()).parseFromString(html, 'text/html'))
    .then(dom => Array.from(dom.querySelectorAll('img.chapter-img')).map(imageElement => window.atob(imageElement.dataset.img)));

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
      );
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

})(axios, JSZip, saveAs, ImageDownloader);