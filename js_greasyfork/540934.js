// ==UserScript==
// @name         AnimebbgDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for animebbg.net
// @icon         https://animebbg.net/styles/default/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/540934-animebbgdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://animebbg.net/comics/capitulo/link/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540934/AnimebbgDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540934/AnimebbgDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const title = document.querySelector('.p-body-header .p-title h1.p-title-value')?.textContent.trim() || document.title.split(' | ').shift();

  // get url of images
  const urls = Array.from(document.querySelectorAll('.media-container .media-container-image img.js-mediaImage')).map(imageElement => imageElement.src);

  // add style patch
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #ImageDownloader-StartNumInput,
    #ImageDownloader-EndNumInput {
      background-color: #FFFFFF;
      color: #000000;
    }`;
  document.head.appendChild(styleElement);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title
  });
  
  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => getImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  function getImage(url) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(_resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'arraybuffer',
          onload: res => _resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;

        // draw the image on canvas
        ctx.drawImage(this, 0, 0);

        // output the image
        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);