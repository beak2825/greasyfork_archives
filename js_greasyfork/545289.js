// ==UserScript==
// @name         MangaMeeDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for manga-mee.jp
// @icon         https://manga-mee.jp/assets/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/545289-mangameedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://manga-mee.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545289/MangaMeeDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545289/MangaMeeDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/manga-mee\.jp\/detail\/\d+/;
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

  // get title
  const title = await new Promise(resolve => {
    const timer = setInterval(() => {
      const target = document.querySelector('div[class*="bg-pale-green-weak"] > p');
      if (target) {
        clearInterval(timer);
        resolve(target.textContent.trim());
      }
    }, 200);
  });

  // get config
  const { title_id, episode_id } = document.head.querySelector('meta[property="og:url"]').getAttribute('content').match(/detail\/(?<title_id>\d+)\?episodeId=(?<episode_id>\d+)/).groups;
  const configString = await fetch(`https://prod2-android.manga-mee.jp/web/v1/title_detail?title_id=${title_id}&episode_id=${episode_id}`).then(res => res.text());

  // get pages
  const matchResults = configString.matchAll(new RegExp(`(?<url>https:\/\/prod-img\.manga-mee\.jp\/.*\/${episode_id}\/manga_page_web.*expires=\\d{10}).*(?<key>[0-9a-f]{128})`, 'g'));
  const pages = Array.from(matchResults).map(result => result.groups);

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
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get decrypted image
  async function getDecryptedImage(page) {
    let imageArrayBuffer = await new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: page.url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });

    // xor decode
    const decode = (data, key) => {
      const n = new Uint8Array(data);
      const r = new Uint8Array(key.match(/.{1,2}/g).map((part) => parseInt(part, 16)));
      for (let i = 0; i < n.length; i++) {
        n[i] ^= r[i % r.length];
      }
      return n;
    }

    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(decode(imageArrayBuffer, page.key).reduce((data, byte) => data + String.fromCharCode(byte), ''));
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