// ==UserScript==
// @name         PiccomaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for piccoma.com
// @icon         https://piccoma.com/static/web/img/common/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451876-piccomadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://piccoma.com/web/viewer/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1293977/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/488316/PiccomaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/488316/PiccomaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/piccoma\.com\/web\/viewer\/.*\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

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
  //const title = unsafeWindow._pdata_.title;
  // 定义需要删除的固定字符串列表（可后续追加）
  const unwantedStrings = [
    'コミック版（分冊版）',
    '（コミック）',
    '【単話版】',
    'コミック版 （分冊版）',
    '【電子単行本版】'
  ];
  const title0 = document.querySelector('meta[name="keywords"]').getAttribute('content').split(/[,，]/)[0].trim();
  // 删除不需要的固定字符串
  let title1 = title0;
  unwantedStrings.forEach(str => {
    const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 转义正则特殊字符
    title1 = title1.replace(new RegExp(escapedStr, 'g'), '');
  });
  // 清理多余空格（连续多个空格变单个空格，并去掉首尾空格）
  title1 = title1.replace(/\s+/g, ' ').trim();
  const title2 = document.querySelector('head title').textContent.split('｜')[0].trim();
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
    title: `${title1} ${title2}`
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const result = unsafeWindow.unscrambleImg(image, 50, data.seed);
        result[0].toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
