// ==UserScript==
// @name         YawaspiDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for yawaspi.com
// @icon         https://yawaspi.com/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451885-yawaspidownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://yawaspi.com/*/comic/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469742/YawaspiDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469742/YawaspiDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/yawaspi\.com\/.*\/comic\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // get title
  const title1 = await new Promise(resolve => {
    const timer = setInterval(() => {
      const titleElement = document.querySelector('.page__header h2');
      if (titleElement) {
        clearInterval(timer);
        resolve(titleElement.textContent);
      }
    }, 200);
  });
  const title2 = await new Promise(resolve => {
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
    title: `${title1} ${title2}`,
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