// ==UserScript==
// @name         MangaOneDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for manga-one.com
// @icon         https://manga-one.com/assets/meta/favicon.png
// @homepageURL  https://greasyfork.org/scripts/545288-mangaonedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://manga-one.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545288/MangaOneDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545288/MangaOneDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/manga-one\.com\/manga\/\d+\/chapter\/\d+/;
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

  // get chapter title
  const title = document.title.split(' | ').shift();

  // get chapter config
  const { title_id, chapter_id } = window.location.pathname.match(/\/manga\/(?<title_id>\d+)\/chapter\/(?<chapter_id>\d+)/).groups;
  const configString = await fetch(`https://manga-one.com/api/client?rq=viewer_v2&title_id=${title_id}&chapter_id=${chapter_id}`, { method: 'POST' }).then(res => res.text());

  // get chapter pages
  const urls = configString.match(new RegExp(`https:\/\/app\.manga-one\.com\/.*\/${chapter_id}\/.*expires=\\d{10}`, 'g'));
  const pages = urls.map(url => {
    const page = { url, isEncrypted: false };
    if (url.includes('.enc?')) {
      page.isEncrypted = true;
      page.crypto = configString.match(/(?<key>[0-9a-f]{64}).*(?<iv>[0-9a-f]{32})/).groups;
    }
    return page;
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title,
    imageSuffix: 'png'
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  async function getImage(page) {
    let imageArrayBuffer = await new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: page.url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });

    if (page.isEncrypted) {
      const unhex = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((part) => parseInt(part, 16)));
      const key = await crypto.subtle.importKey('raw', unhex(page.crypto.key), 'AES-CBC', false, ['decrypt']);
      imageArrayBuffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: unhex(page.crypto.iv) }, key, imageArrayBuffer);
    }

    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);