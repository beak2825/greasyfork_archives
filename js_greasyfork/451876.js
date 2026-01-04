// ==UserScript==
// @name         PiccomaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for piccoma.com
// @icon         https://piccoma.com/static/web/img/common/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451876-piccomadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://piccoma.com/web/viewer/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451876/PiccomaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451876/PiccomaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // wait for the data and method generate by other scripts
  await new Promise(resolve => {
    const timer = setInterval(() => {
      if (unsafeWindow._pdata_ && unsafeWindow.dd && unsafeWindow.get_seed && unsafeWindow.unscrambleImg) {
        clearInterval(timer);
        resolve();
      }
    }, 500);
  });

  // generate title and data of images
  const title = unsafeWindow._pdata_.title;
  const imageData = unsafeWindow._pdata_.img.filter(img => img.path !== '').map(config => {
    const url = new URL('https:' + config.path);
    const sum = url.pathname.split('/')[4];
    const expire = url.search.match(/\d{10}/)[0];
    config.url = 'https:' + config.path;
    config.seed = unsafeWindow.dd(unsafeWindow.get_seed(sum, expire));
    delete config.path;
    return config;
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageData.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => getImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }
  
  // get promise of image
  async function getImage(data) {
    const imageArrayBuffer = await new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: data.url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });

    // no need to unscramble image
    if (!unsafeWindow._pdata_.isScrambled) {
      return imageArrayBuffer;
    }

    // need to unscramble image
    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const result = unsafeWindow.unscrambleImg(image, 50, data.seed);
        result[0].toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);