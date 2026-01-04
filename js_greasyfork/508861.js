// ==UserScript==
// @name         RawdevartDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for rawdevart.art
// @icon         https://rawdevart.art/public/icons/rawdevart-60x60.png
// @homepageURL  https://greasyfork.org/scripts/508861-rawdevartdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://rawdevart.art/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/508861/RawdevartDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/508861/RawdevartDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/rawdevart\.art\/read\/.*/;
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
  const title = document.querySelector('h1.chapter-title').textContent;

  // get manga id
  const mangaID = document.querySelector('#manga-id').getAttribute('value');

  // get chapter id
  const chapterID = window.location.pathname.match(/chapter-(?<chapterID>[0-9\.]+)/).groups.chapterID;

  // get chapter detail
  const chapterDetail = await axios.get(`https://rawdevart.art/spa/manga/${mangaID}/${chapterID}`).then(res => res.data.chapter_detail);

  // get url of images
  const parser = new DOMParser();
  const contentDocument = parser.parseFromString(chapterDetail.chapter_content, 'text/html');
  const canvasElements = contentDocument.querySelectorAll('canvas');
  const urls = Array.from(canvasElements).map(canvas => `${chapterDetail.server}${canvas.dataset.srcset}`);

  // add style patch
  const styleElement = document.createElement('style');
  styleElement.textContent = `#ImageDownloader-RangeInputContainer input { color: #000 !important; }`;
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
      )
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