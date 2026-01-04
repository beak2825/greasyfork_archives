// ==UserScript==
// @name         MangaboxDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.mangabox.me
// @icon         https://image-a.mangabox.me/static/assets/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/455860-mangaboxdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.mangabox.me/reader/*/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455860/MangaboxDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455860/MangaboxDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get episode data
  const { episodeID } = window.location.pathname.match(/episodes\/(?<episodeID>\d+)/).groups;
  const episodeData = await axios.get(`https://www.mangabox.me/api/honshi/episode/${episodeID}/images`).then(res => res.data);

  // get url of images
  const imageURLs = episodeData.imageUrls;

  // get title
  const title = await new Promise(resolve => {
    const timer = setInterval(() => {
      const targetElement = document.querySelector('[class*=_title__sub_]');
      if (targetElement) {
        clearInterval(timer);
        resolve(targetElement.textContent.trim());
      }
    }, 200);
  });

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
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).map(i => i ^ episodeData.mask).reduce((data, byte) => data + String.fromCharCode(byte), ''));
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