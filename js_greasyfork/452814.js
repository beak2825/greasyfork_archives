// ==UserScript==
// @name         LineMangaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for manga.line.me
// @icon         https://static.line-scdn.net/line_manga_web/edge/pc/img/favicon_v6.png
// @homepageURL  https://greasyfork.org/scripts/452814-linemangadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://manga.line.me/*/viewer*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451812/1096723/PublusCoordsGenerator.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452814/LineMangaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/452814/LineMangaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator) {
  'use strict';

  // get data of images and handler
  const { imageData, handler } = await new Promise(resolve => {
    const timer = setInterval(async () => {
      const option = unsafeWindow.OPTION;
      if (!option) return;

      // type 1, normal image
      const imgs = option.imgs || {};
      const imgsLength = Object.keys(imgs).length;
      if (imgsLength) {
        imgs.length = imgsLength;
        resolve({
          imageData: Array.from(imgs),
          handler: getNormalImage
        });
        clearInterval(timer);
        return;
      }

      // type 2, encrypted image
      const portalPages = option.portalPages || {};
      const portalPagesLength = Object.keys(portalPages).length;
      if (portalPagesLength) {
        portalPages.length = portalPagesLength;
        resolve({
          imageData: Array.from(portalPages),
          handler: getDecryptedImage
        });
        clearInterval(timer);
        return;
      }

      // type 3, using Publus reader
      const { mediado_contents_url, mediado_contents_file, mediado_token } = option;
      if (mediado_contents_url && mediado_contents_file && mediado_token) {
        const config = await new Promise(_resolve => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `${mediado_contents_url}${mediado_contents_file}?token=${mediado_token}`,
            responseType: 'json',
            onload: res => _resolve(res.response)
          });
        });

        resolve({
          imageData: config.configuration.contents.map(content => ({
            url: `${mediado_contents_url}${content.file}/0.jpeg?token=${mediado_token}`,
            pattern: Array.from(content.file + '/0').reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % 4 + 1
          })),
          handler: getPublusImage
        });

        clearInterval(timer);
      }
    }, 500);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageData.length,
    getImagePromises,
    title: unsafeWindow.OPTION.title
  });

  // collect promises of images
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => handler(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get normal image
  function getNormalImage(data) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: data.url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

  // get decrypted image
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await axios.get(data.url, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // extract data from metadata
        const columnCount = data.metadata.hc;
        const pieceWidth = data.metadata.bwd;
        const imageWidth = data.metadata.iw;
        const imageHeight = data.metadata.ih;

        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0);

        // draw pieces on correct position
        data.metadata.m.forEach((data, index) => {
          const parsed = parseInt(data, 35);
          const srcX = (parsed % columnCount) * pieceWidth;
          const srcY = Math.floor(parsed / columnCount) * pieceWidth;
          const destX = (index % columnCount) * pieceWidth;
          const destY = Math.floor(index / columnCount) * pieceWidth;
          context.drawImage(image, srcX, srcY, pieceWidth, pieceWidth, destX, destY, pieceWidth, pieceWidth);
        });

        canvas.toBlob(resolve);
      }
    });
  }

  // get Publus image
  function getPublusImage(data) {
    return new Promise(async resolve => {
      const imageArraybuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArraybuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;

        // draw pieces on correct position
        const coordConfigs = PublusCoordsGenerator(this.width, this.height, 64, 64, data.pattern);
        for (const { srcX, srcY, destX, destY, width, height } of coordConfigs) {
          ctx.drawImage(image, destX, destY, width, height, srcX, srcY, width, height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator);