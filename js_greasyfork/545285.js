// ==UserScript==
// @name         RawnicoDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for nicomanga.com
// @icon         https://nicomanga.com/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/545285-rawnicodownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://nicomanga.com/read-*.html
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/545285/RawnicoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545285/RawnicoDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get chapter title
  const title = document.title.split(' - NicoManga - ').shift();

  // get chapter id
  const cid = document.querySelector('input#chapter').getAttribute('value');

  // get image urls
  const urls = await fetch(`https://nicomanga.com/app/manga/controllers/cont.imgsList.php?cid=${cid}`)
    .then(res => res.text())
    .then(html => {
      const dom = (new DOMParser()).parseFromString(html, 'text/html');
      return Array.from(dom.querySelectorAll('img.chapter-img')).map(imgElement => imgElement.dataset.srcset.trim());
    });

  // add style patch
  const styleElement = document.createElement('style');
  styleElement.textContent = `#ImageDownloader-StartNumInput, #ImageDownloader-EndNumInput { color: #000; }`;
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