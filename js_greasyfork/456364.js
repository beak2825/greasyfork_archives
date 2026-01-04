// ==UserScript==
// @name         RentaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for renta.papy.co.jp
// @icon         https://renta.papy.co.jp/renta/img/logo/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/456364-rentadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://*.papy.co.jp/sc/view_*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456364/RentaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/456364/RentaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  if (!window.location.pathname.endsWith('index.view')) return;

  // clear the onkeydown callback
  if (unsafeWindow.f_on_keydown) {
    await new Promise(resolve => {
      const timer = setInterval(() => {
        if (document.onkeydown) {
          document.onkeydown = () => {};
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  }

  // collect data of images
  const imageData = Array.from({ length: unsafeWindow.max_page }, (_, index) => ({
    url: `${unsafeWindow.url_base2}${index + 1}?date=${unsafeWindow.cache_update}&${unsafeWindow.auth_key}&origin=s_${window.location.hostname}`,
    order: index + 1
  }));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageData.length,
    getImagePromises,
    title: unsafeWindow.prd_ser,
    zipOptions: { base64: true }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data.url, data.order)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(url, imageOrder) {
    /* 
      Fetch data from url, convert it to Uint8Array type, then it can be divided into 3 parts:
      1. [0, 9)                     - data in this range indicates the length of rangeData
      2. [9, 9 + rangeDataLength)   - data in this range indicates image's width, image's height, data range of image pieces
      3. [9 + rangeDataLength, end] - data in this range is the concat result of shuffled image pieces
    */
    const imageUint8Array = await axios.get(url, { responseType: 'arraybuffer' }).then(res => new Uint8Array(res.data));
    const rangeDataLength = parseInt(imageUint8Array.slice(0, 9).reduce((acc, cur) => acc + String.fromCharCode(cur), ''), 10);
    const rangeDataString = imageUint8Array.slice(9, 9 + rangeDataLength).reduce((acc, cur) => acc + String.fromCharCode(cur), '');
    const dataArray = imageUint8Array.slice(9 + rangeDataLength);

    // images are always sliced into 7 pieces vertically and 7 pieces horizontally
    const x = 7;
    const y = 7;
    const [imageWidth, imageHeight, restWidthRangeData, restHeightRangeData] = rangeDataString.split("|").slice(0, 4);
    const rangeData = rangeDataString.split("|").slice(4);

    // create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // calculate width & height of pieces
    const pieceWidth = parseInt(imageWidth / x);
    const pieceHeight = parseInt(imageHeight / y);

    // if there are extra pieces, draw them to the canvas
    const restWidth = parseInt(imageWidth % x);
    const restHeight = parseInt(imageHeight % y);
    if (restWidth) await drawImagePiece(ctx, getImagePiece(restWidthRangeData, dataArray), 0, 0);
    if (restHeight) await drawImagePiece(ctx, getImagePiece(restHeightRangeData, dataArray), 0, 0);

    // -------------------- calculate-original-location-of-pieces-area --------------------
    let pieceIndexData = new Array(x);

    // 初期配値、配列設定
    let counter = 0;
    for (let i = 0; i < y; i++) {
      pieceIndexData[i] = new Array(y);
      for (let j = 0; j < x; j++) {
        pieceIndexData[i][j] = counter;
        counter++;
      }
    }

    // 横の位置戻す
    for (let i = 0; i < y; i++) {
      const tempArray = new Array(x);
      let st = x - i % x;
      for (let j = 0; j < x; j++) {
        if (st >= x) {
          st = 0;
        }
        tempArray[j] = pieceIndexData[i][st];
        st += 1;
      }
      for (let j = 0; j < x; j++) {
        pieceIndexData[i][j] = tempArray[j];
      }
    }

    // 縦の位置戻す
    for (let i = 0; i < x; i++) {
      const tempArray = new Array(y);
      let st = y - i % y;
      for (let j = 0; j < y; j++) {
        if (st >= y) {
          st = 0;
        }
        tempArray[j] = pieceIndexData[st][i];
        st += 1;
      }
      for (let j = 0; j < y; j++) {
        pieceIndexData[j][i] = tempArray[j];
      }
    }

    // シャッフル戻す
    const maxLoop = 20;
    for (let i = 0; i < x; i++) {
      const num = i + 1;
      let seed = parseInt(imageOrder) + parseInt(unsafeWindow.prd_ser);
      if (seed % maxLoop == 0) {
        seed = Math.abs(imageOrder - unsafeWindow.prd_ser) + (maxLoop + 1);
      }
      const k = parseInt(((num * seed) + (imageOrder / maxLoop)) % maxLoop);
      for (let j = k - 1; j >= 0; j--) {
        pieceIndexData = unsafeWindow.f_shuffle_r(pieceIndexData, j, i, y);
      }
    }

    const pieceAmount = x * y;
    const destCoordData = new Array(pieceAmount);
    for (let i = 0; i < y; i++) {
      for (let j = 0; j < x; j++) {
        const index = pieceIndexData[i][j];
        destCoordData[index] = {
          destX: restWidth + (j * pieceWidth),
          destY: restHeight + (i * pieceHeight)
        }
      }
    }
    // ------------------------------------------------------------------------------------

    // draw image piece to the right location on canvas
    for (let i = 0; i < pieceAmount; i++) {
      await drawImagePiece(ctx, getImagePiece(rangeData[i], dataArray), destCoordData[i].destX, destCoordData[i].destY);
    }
    
    return canvas.toDataURL().replace('data:image/png;base64,', '');
  }

  // get an image piece in base64 format
  function getImagePiece(rangeData, data) {
    const [startIndex, length] = rangeData.split(',').map(str => parseInt(str));
    const result = data.slice(startIndex, startIndex + length).reduce((acc, cur) => acc + String.fromCharCode(cur), '');
    return 'data:image/jpeg;base64,' + window.btoa(result);
  }

  // draw image piece to specific location on canvas
  function drawImagePiece(canvasContext, imageSrc, destX, destY) {
    return new Promise(resolve => {
      const image = document.createElement('img');
      image.src = imageSrc;
      image.onload = function () {
        canvasContext.drawImage(image, 0, 0, this.width, this.height, destX, destY, this.width, this.height);
        resolve();
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);