// ==UserScript==
// @name         ComicRyuDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-ryu.jp
// @icon         https://www.comic-ryu.jp/wp-content/themes/comicryu2024/ico.png
// @homepageURL  https://greasyfork.org/scripts/455399-comicryudownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://*.comic-ryu.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455399/ComicRyuDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455399/ComicRyuDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get DOM
  const dom = await fetch(window.location.href)
    .then(res => res.text())
    .then(html => (new DOMParser()).parseFromString(html, 'text/html'));

  // script ends here if not in chapter page
  const viewerElement = dom.querySelector('section.m-viewer-swiper-container');
  if (!viewerElement) return;

  // get title
  const title = dom.querySelector('.m-viewer-title-container h1.m-viewer-title').textContent.trim();

  // get url of images
  const imageURLs = Array.from(dom.querySelectorAll('figure.wp-block-image img')).map(imgElement => imgElement.src);

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
  function getImage(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);