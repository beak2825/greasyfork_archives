// ==UserScript==
// @name         BookliveDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for booklive.jp
// @icon         https://booklive.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/452562-booklivedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://booklive.jp/bviewer/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452562/BookliveDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/452562/BookliveDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools) {
  'use strict';

  // collect essential params
  const cid = new URL(window.location.href).searchParams.get('cid');
  const randomString = SpeedReaderTools.generateRandomString32(cid);

  // generate config data
  const config = await axios({
    method: 'GET',
    url: `https://booklive.jp/bib-api/bibGetCntntInfo?cid=${cid}&dmytime=${Date.now()}&k=${randomString}`
  }).then(res => {
    const data = res.data.items[0];
    return {
      title: data.Title,
      contentServer: data.ContentsServer,
      ctbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ctbl),
      ptbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ptbl),
      p: data.p
    }
  });

  // check if trial or not
  const isTrial = config.contentServer.includes('trial');

  // get content data
  const contentData = isTrial 
    ? await axios.get(`${config.contentServer}/content.js`).then(res => res.data).then(jsonp => JSON.parse(jsonp.slice(jsonp.indexOf('{'), jsonp.lastIndexOf('}') + 1)))
    : await axios.get(`${config.contentServer}/sbcGetCntnt.php?cid=${cid}&p=${config.p}`).then(res => res.data);

  // generate data of image files
  const doc = (new DOMParser()).parseFromString(contentData.ttx, 'text/html');
  let files = Array.from(doc.querySelectorAll('t-img')).map(element => {
    const filename = element.getAttribute('src');
    const width = element.getAttribute('orgwidth');
    const height = element.getAttribute('orgheight');
    const src = isTrial ? `${config.contentServer}/${filename}/M_H.jpg` : `${config.contentServer}/sbcGetImg.php?cid=${cid}&src=${encodeURIComponent(filename)}&p=${config.p}`;
    return { filename, width, height, src };
  });
  files = files.slice(0, files.length / 2);

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

  // get promise of decrypted image
  function getDecryptedImage(file) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await axios.get(file.src, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
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

        // if trial, clear those transparent pixel
        if (isTrial) {
          let originalWidth;
          for (let w = canvas.width; w >= 0; w--) {
            const px = canvas.getContext('2d').getImageData(w, 0, 1, 1);
            if (!Array.from(px.data).every(data => data === 0)) {
              originalWidth = w;
              break;
            }
          }

          let originalHeight;
          for (let h = canvas.height; h >= 0; h--) {
            const px = canvas.getContext('2d').getImageData(0, h, 1, 1);
            if (!Array.from(px.data).every(data => data === 0)) {
              originalHeight = h;
              break;
            }
          }

          canvas.width = originalWidth;
          canvas.height = originalHeight;
          ctx = canvas.getContext('2d');

          for (const { srcX, srcY, destX, destY, width, height } of coords) {
            ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
          }
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools);