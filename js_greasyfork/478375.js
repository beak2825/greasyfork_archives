// ==UserScript==
// @name         ZerosumonlineDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for zerosumonline.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerosumonline.com
// @homepageURL  https://greasyfork.org/scripts/478375-zerosumonlinedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://zerosumonline.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478375/ZerosumonlineDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/478375/ZerosumonlineDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/zerosumonline\.com\/episode\/.*\/chapter\/.*/;
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

  // get chapter ID
  const chapterId = document.body.innerHTML.match(/\\"decodedChapterId\\":\\"(?<id>\d+)\\"/).groups.id;

  // get title and urls
  const title = document.title.split('|')[1] + ' ' + document.title.split('|')[0];
  const imageURLs = await axios
    .post(`https://api.zerosumonline.com/api/v1/viewer?chapter_id=${chapterId}`)
    .then(res => res.data)
    .then(data => data.match(/https:\/\/contents\.zerosumonline\.com\/chapter_page\/\d+\/\d+\.webp/g))
    .then(matchResult => Array.from(matchResult));

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
  async function getImage(url) {
    const imageArrayBuffer = await new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });

    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);