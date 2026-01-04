// ==UserScript==
// @name         SpeedbinbDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader specific for Speedbinb reader
// @icon         https://kirapo.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451879-speedbinbdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.123hon.com/vw/*
// @match        https://www.comic-valkyrie.com/samplebook/*
// @match        https://televikun-super-hero-comics.com/*/*/*
// @match        https://kirapo.jp/pt/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451879/SpeedbinbDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451879/SpeedbinbDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader) {
  'use strict';
  
  // get base URL
  let baseURL = window.location.href;
  if (baseURL.includes('123hon.com')) baseURL = baseURL.replace('index.html', '');
  if (baseURL.includes('kirapo.jp')) baseURL = baseURL.replace('viewer', '');

  // get url of json files
  const html = await axios.get(window.location.href).then(res => res.data);
  const urls = html.match(/data\/\d+\.ptimg\.json/gm).map(json => baseURL + json);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title: document.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => getDecryptedImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  function getDecryptedImage(url) {
    return new Promise(async resolve => {
      // get config of image
      const config = await axios.get(url).then(res => res.data);

      const image = document.createElement('img');
      image.src = `${baseURL}data/${config.resources.i.src}`;
      image.onload = function () {
        // create destination canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = config.views[0].width;
        canvas.height = config.views[0].height;

        // get coordinates, width, height of pieces
        const coords = config.views[0].coords.map(coord => {
          const items = coord.match(/^([^:]+):(\d+),(\d+)\+(\d+),(\d+)>(\d+),(\d+)$/);
          if (!items) throw new Error("Invalid format for Image Transfer : " + coord);

          return {
            srcX: parseInt(items[2], 10),
            srcY: parseInt(items[3], 10),
            width: parseInt(items[4], 10),
            height: parseInt(items[5], 10),
            destX: parseInt(items[6], 10),
            destY: parseInt(items[7], 10)
          }
        });

        // draw pieces on correct position
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
        }

        canvas.toBlob(resolve, 'image/jpeg', 1);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);