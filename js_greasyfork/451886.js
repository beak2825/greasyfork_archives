// ==UserScript==
// @name         YomongaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.yomonga.com
// @icon         https://www.yomonga.com/wp-content/themes/yomonga-theme/assets/favicon/favicon_64x64.ico
// @homepageURL  https://greasyfork.org/scripts/451886-yomongadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.yomonga.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451886/YomongaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451886/YomongaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/www\.yomonga\.com\/titles\/.*/;
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
    url: `https://www.yomonga.com/binb/sws/apis/bibGetCntntInfo.php?cid=${cid}&dmytime=${Date.now()}&k=${randomString}`
  }).then(res => {
    const data = res.data.items[0];
    return {
      title: data.Title,
      contentServer: data.ContentsServer,
      ctbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ctbl),
      ptbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ptbl),
    }
  });

  // get data of image files
  const files = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${config.contentServer}content`,
      responseType: 'json',
      onload: res => {
        const matchResult = res.response.ttx.matchAll(/(images\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(\d*)" orgheight="(\d*)"/gm);
        const result = Array.from(matchResult).map(match => ({
          filename: match[1],
          width: parseInt(match[2]),
          height: parseInt(match[3]),
          src: `${config.contentServer}img/${match[1]}?q=1`
        }));
        resolve(result.slice(0, result.length / 2));
      }
    });
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
      const imageArrayBuffer = await new Promise(_resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: file.src,
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
        canvas.width = file.width;
        canvas.height = file.height;

        // fill the canvas with 'skyblue' color
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // get coords
        const key = SpeedReaderTools.getDecryptionKey(file.filename, config.ctbl, config.ptbl);
        const decoder = new SpeedReaderTools.CoordDecoder(key[0], key[1]);
        const coords = decoder.getCoords(this);

        // draw pieces on correct position
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
        }

        // get full image data
        const fullImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // get real width of image
        let realWidth = 0;
        for (let sx = canvas.width - 1; sx >= 0; sx--) {
          const pixelData = ctx.getImageData(sx, 0, 1, 1).data;
          if (pixelData[0] === 135 && pixelData[1] === 206 && pixelData[2] === 235 && pixelData[3] === 255) continue;
          else { realWidth = sx + 1; break; }
        }

        // get real height of image
        let realHeight = 0;
        for (let sy = canvas.height - 1; sy >= 0; sy--) {
          const pixelData = ctx.getImageData(0, sy, 1, 1).data;
          if (pixelData[0] === 135 && pixelData[1] === 206 && pixelData[2] === 235 && pixelData[3] === 255) continue;
          else { realHeight = sy + 1; break; }
        }

        // resize canvas and put image data back
        canvas.width = realWidth;
        canvas.height = realHeight;
        ctx.putImageData(fullImageData, 0, 0);

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);