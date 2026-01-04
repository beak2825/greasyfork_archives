// ==UserScript==
// @name         Bato
// @namespace    https://bato.si/
// @icon         https://bato.si/static-assets/img/bato-favicon.ico
// @version      0.4
// @license      GPL-3.0
// @description  Ripear mangas de Bato
// @author       bega_ YT_
// @match        https://bato.si/*/*/*
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536828/Bato.user.js
// @updateURL https://update.greasyfork.org/scripts/536828/Bato.meta.js
// ==/UserScript==

(function(JSZip, saveAs, ImageDownloader) {
  'use strict';

  // 1. Obtener título del capítulo
  const title = document.title.replace(/\s*\|\s*.*$/, '').trim();

  // 2. Obtener las imágenes con clase 'image-item'
  const imageElements = document.querySelectorAll('div[data-name="image-item"] img[src]');
  const imageURLs = Array.from(imageElements).map(img => img.src);

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

  // 5. Descargar imagen con 
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