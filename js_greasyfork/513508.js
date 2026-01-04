// ==UserScript==
// @name         CorocoroDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for corocoro.jp
// @icon         https://www.corocoro.jp/assets/app-icon/favicon.png
// @homepageURL  https://greasyfork.org/scripts/513508-corocorodownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.corocoro.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513508/CorocoroDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513508/CorocoroDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/www.corocoro\.jp\/chapter\/\d+\/viewer/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // add info
  const infoElement = document.createElement('span');
  infoElement.innerHTML = `如果下载面板不出现，请确保阅读器处于双页模式，然后点击下一页。<br>If the download panel does not appear, please make sure the viewer is in double-page mode, then go next page.`;
  infoElement.style = `position: fixed; top: 12px; left: 72px; padding: 8px 10px; background-color: #000; border-radius: 4px; color: #FFF; font-family: Microsoft YaHei, PingFang SC; font-size: 12px;`;
  document.body.appendChild(infoElement);

  // try to capture data of pages
  let pages;
  const originPush = Array.prototype.push;
  Array.prototype.push = function() {
    const target = arguments[0];
    if (
      pages === undefined
      && target instanceof Array
      && target.length > 0
      && target.some(item => item?.side === 'center')
    ) {
      pages = this.flat().map(item => ({ src: item.src.url, crypto: item.src.crypto })).filter(item => item.src && item.crypto);
    }
    return originPush.apply(this, arguments);
  }

  // wait until data of pages being captured
  await new Promise(resolve => {
    const timer = setInterval(() => {
      if (pages) { infoElement.remove(); clearInterval(timer); resolve(); }
    }, 200);
  });

  // get title
  const mangaTitle = document.querySelector('div.flex.flex-col:has(p):has(h3) > p')?.textContent;
  const chapterTitle = document.querySelector('div.flex.flex-col:has(p):has(h3) > h3')?.textContent;
  const title = (mangaTitle && chapterTitle) ? `${mangaTitle} ${chapterTitle}` : document.title.split(' | ').shift();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(page) {
    const unhex = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((part) => parseInt(part, 16)));
    const encryptedImageArrayBuffer = await axios.get(page.src, { responseType: 'arraybuffer' }).then(res => res.data);
    const key = await crypto.subtle.importKey('raw', unhex(page.crypto.key), 'AES-CBC', false, ['decrypt']);
    const decryptedImageArrayBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: unhex(page.crypto.iv) }, key, encryptedImageArrayBuffer);
    return decryptedImageArrayBuffer;
  }

})(axios, JSZip, saveAs, ImageDownloader);