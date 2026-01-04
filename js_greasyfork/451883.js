// ==UserScript==
// @name         WelomaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for weloma.art
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weloma.art
// @homepageURL  https://greasyfork.org/scripts/451883-welomadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://weloma.art/*/*/
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451883/WelomaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451883/WelomaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = document.querySelector('.chapter-content-top ol.breadcrumb li:last-of-type > a').getAttribute('title');

  // get url of images
  const imageURLs = await new Promise(resolve => {
    const timer = setInterval(() => {
      const urls = [];
      document.querySelectorAll('img.chapter-img').forEach(img => urls.push(img.src));
      if(urls.every(url => !url.includes('loading'))) {
        console.log(urls);
        resolve(urls);
        clearInterval(timer);
      }
    }, 200);
  });

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