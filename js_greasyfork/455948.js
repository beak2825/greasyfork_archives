// ==UserScript==
// @name         GanganonlineDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.ganganonline.com
// @icon         https://www.ganganonline.com/32_32.ico
// @homepageURL  https://greasyfork.org/scripts/455948-ganganonlinedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.ganganonline.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455948/GanganonlineDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455948/GanganonlineDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/www\.ganganonline\.com\/title\/.*\/chapter\/.*/;
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

  // collect url of images and title
  const { imageURLs, title } = await new Promise(resolve => {
    const timer = setInterval(() => {
      try {
        const target = document.getElementById('__NEXT_DATA__');
        const chapterData = JSON.parse(target.textContent).props.pageProps.data;
        if (chapterData) {
          clearInterval(timer);
          resolve({
            imageURLs: chapterData.pages.map(page => window.location.origin + (page.image || page.linkImage).imageUrl),
            title: chapterData.chapterName
          });
        }
      } catch (error) {
        console.log(error);
      }
    }, 200);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title,
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
      const image = document.createElement('img');
      image.src = url;
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