// ==UserScript==
// @name         YawaspiDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for yawaspi.com
// @icon         https://yawaspi.com/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451885-yawaspidownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://yawaspi.com/*/comic/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451885/YawaspiDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451885/YawaspiDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = await new Promise(resolve => {
    const timer = setInterval(() => {
      const titleElement = document.querySelector('.page__header h3');
      if (titleElement) {
        clearInterval(timer);
        resolve(titleElement.textContent);
      }
    }, 200);
  });

  // get url of images
  const imageURLs = await new Promise(resolve => {
    const timer = setInterval(() => {
      const imgElements = document.querySelectorAll('.vertical__inner ul li img');
      if (imgElements) {
        clearInterval(timer);
        resolve(Array.from(imgElements).map(element => element.src));
      }
    }, 200);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title,
    positionOptions: { left: '320px' }
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