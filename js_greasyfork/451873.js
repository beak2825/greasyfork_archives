// ==UserScript==
// @name         MangaFactoryDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for r-cbs.mangafactory.jp under manga-mee.jp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=r-cbs.mangafactory.jp
// @homepageURL  https://greasyfork.org/scripts/451873-mangafactorydownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        *://r-cbs.mangafactory.jp/*/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451873/MangaFactoryDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451873/MangaFactoryDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools) {
  'use strict';

  // collect essential params
  const { cid, randomString } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const contentElement = document.getElementById('content');
      if (contentElement && contentElement.dataset.ptbinbCid) {
        resolve({
          cid: contentElement.dataset.ptbinbCid,
          randomString: SpeedReaderTools.generateRandomString32(contentElement.dataset.ptbinbCid)
        });
        clearInterval(timer);
      }
    }, 200);
  });

  // generate config data
  const config = await axios({
    method: 'GET',
    url: `${window.location.origin}/~/bibGetCntntInfo?cid=${cid}&dmytime=${Date.now()}&k=${randomString}`
  }).then(res => {
    const data = res.data.items[0];
    return {
      title: data.Title,
      contentServer: window.location.protocol + data.ContentsServer,
      ctbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ctbl),
      ptbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ptbl),
    }
  });

  // get data of image files
  const files = await axios({
    method: 'GET',
    url: `${config.contentServer}sbcGetCntnt.php?cid=${cid}`
  }).then(res => {
    const matchResult = res.data.ttx.matchAll(/(pages\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(\d*)" orgheight="(\d*)"/gm);
    const result = Array.from(matchResult).map(match => ({
      filename: match[1],
      width: parseInt(match[2]),
      height: parseInt(match[3]),
      src: `${config.contentServer}sbcGetImg.php?cid=${cid}&src=${match[1]}`
    }));
    return result.slice(0, result.length / 2);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: files.length,
    getImagePromises,
    title: config.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return files
      .slice(startNum - 1, endNum)
      .map(file => getDecryptedImage(file)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get decrypted image
  function getDecryptedImage(file) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await axios.get(file.src, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = file.width;
        canvas.height = file.height;

        // get coords
        const key = SpeedReaderTools.getDecryptionKey(file.filename, config.ctbl, config.ptbl);
        const decoder = new SpeedReaderTools.CoordDecoder(key[0], key[1]);
        const coords = decoder.getCoords(this);

        // draw pieces on correct position
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools);