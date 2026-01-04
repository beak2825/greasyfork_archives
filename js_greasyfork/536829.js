// ==UserScript==
// @name         Battwo
// @namespace    https://battwo.com/
// @icon         https://battwo.com/static-assets/img/bato-favicon.ico
// @version      0.1
// @license      GPL-3.0
// @description  Ripear mangas de Battwo
// @author       bega_ YT_
// @match        https://battwo.com/chapter/*
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536829/Battwo.user.js
// @updateURL https://update.greasyfork.org/scripts/536829/Battwo.meta.js
// ==/UserScript==

(function(JSZip, saveAs, ImageDownloader) {
  'use strict';

  // 1. Obtener título del capítulo (si no hay H1, usar fallback)
  const title = document.querySelector('h1')?.textContent?.trim()
              || document.title.replace(/\s*–.*$/, '');

  // 2. Obtener las imágenes con clase 'page-img'
  const imageElements = document.querySelectorAll('img.page-img');
  const imageURLs = Array.from(imageElements).map(el => el.src);
  if (imageURLs.length === 0) {
    alert("No se encontraron imágenes.");
    return;
  }

  // 3. Iniciar ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title
  });

  // 4. Función para obtener promesas de descarga
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => getImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // 5. Descargar imagen con GM_xmlhttpRequest
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

})(JSZip, saveAs, ImageDownloader);
