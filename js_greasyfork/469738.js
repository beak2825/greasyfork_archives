// ==UserScript==
// @name         UrasundayDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for urasunday.com
// @icon         https://urasunday.com/assets/img/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451881-urasundaydownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://urasunday.com/title/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469738/UrasundayDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469738/UrasundayDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title1 = document.querySelector('body > div.title > div.detail > div:nth-child(1) > div.info > h1:nth-child(1)').textContent.trim()
  const title2 = document.querySelector('body > div.title > div:nth-child(1) > div:nth-child(1)').textContent.trim();

  // get image urls from document
  const urls = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.href,
      headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' },
      onload: res => resolve(res.response.match(/src: '.*'/gm).map(url => url.split('\'')[1]))
    });
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title: `${title1} ${title2}`,
    positionOptions: { top: '140px' }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => axios
        .get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);