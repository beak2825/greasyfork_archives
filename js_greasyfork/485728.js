// ==UserScript==
// @name         DLsiteDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for dlsite.com
// @icon         https://www.dlsite.com/images/web/common/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/485728-dlsitedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://play.dlsite.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485728/DLsiteDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/485728/DLsiteDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/play\.dlsite\.com\/.*viewer.*/;
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

  const getFileURLPromise = new Promise(resolve => {
    const originXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      const url = arguments[1];
      if (url.includes('viewer-meta.json')) {
        const getFileURL = (fileName) => url.replace('viewer-meta.json', fileName);
        resolve(getFileURL);
      }
      return originXHROpen.apply(this, arguments);
    }
  });

  const getDecryptedKeyPromise = new Promise(resolve => {
    const originFromCharCode = String.fromCharCode;
    String.fromCharCode = function () {
      const result = originFromCharCode.apply(this, arguments);
      if (arguments.length === 64 && Array.from(arguments).every(charCode => /^[0-9a-f]{1}$/.test(originFromCharCode(charCode)))) {
        resolve(result);
      }
      return result;
    }
  });

  // get URL builder and key of decryption
  const getFileURL = await getFileURLPromise;
  const key = await fetch(getFileURL('decryption.key')).then(res => res.ok ? res.text() : getDecryptedKeyPromise);

  // get tilte and url of images
  const metadata = await fetch(getFileURL('viewer-meta.json')).then(res => res.json());
  const title = metadata.meta_data.title || document.querySelector('h1[class*=titleText]').textContent || `package_${Date.now()}`;
  const urls = metadata.pages.map(page => getFileURL(page.src));

  // add style patch
  const styleElement = document.createElement('style');
  styleElement.textContent = `#ImageDownloader-DownloadButton { text-align: center !important; }`;
  document.head.appendChild(styleElement);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title
  });
  
  // collect promises of decrypted image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => getDecryptedImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(url) {
    const encryptedArrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const n = new Uint8Array(key.match(/.{1,2}/g).map(s => parseInt(s, 16)));
    const r = new Uint8Array(encryptedArrayBuffer);
    const i = n.length;
    for (let s = 0; s < r.length; s++) {
      r[s] ^= n[s % i];
    }
    return r.buffer;
  }

})(axios, JSZip, saveAs, ImageDownloader);