// ==UserScript==
// @name         FutabanetDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for gaugau.futabanet.jp
// @icon         https://gaugau.futabanet.jp/img/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/478408-futabanetdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://gaugau.futabanet.jp/list/work/*/episodes/*
// @match        https://gaugau.futabanex.jp/list/work/*/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/456423/1128886/SpeedReaderTools.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478416/FutabanetDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/478416/FutabanetDownloader.meta.js
// ==/UserScript==
 
(async function (axios, JSZip, saveAs, ImageDownloader, SpeedReaderTools) {
  'use strict';

  // check if using binb reader
  const isBinbReader = await new Promise(resolve => {
    const timer = setInterval(() => {
      const contentElement = document.getElementById('content');
      if (contentElement && contentElement.dataset.ptbinbCid) {
        resolve(true);
        clearInterval(timer);
      }
 
      const tateyomiElement = document.querySelector('.works_tateyomi__img');
      if (tateyomiElement) {
        resolve(false);
        clearInterval(timer);
      }
    }, 200);
  });
 
  // get image files
  let files, config;
  if (isBinbReader) {
    // generate URL of config API
    const cid = document.getElementById('content').dataset.ptbinbCid;
    const randomString = SpeedReaderTools.generateRandomString32(cid);
    const apiSection = document.getElementById('content').dataset.ptbinb;
    const apiURL = `${window.location.origin}${apiSection}&dmytime=${Date.now()}&cid=${cid}&k=${randomString}`;
 
    // get config
    config = await axios.get(apiURL).then(res => {
      const data = res.data.items[0];
      return {
        contentServer: data.ContentsServer,
        ctbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ctbl),
        ptbl: SpeedReaderTools.getDecryptedTable(cid, randomString, data.ptbl),
      }
    });
 
    // get data of image files
    files = await new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${config.contentServer}/content.js?dmytime=${Date.now()}`,
        onload: res => {
          const { ttx } = JSON.parse(res.response.slice(0, res.response.length - 1).replace('DataGet_Content(', ''));
          const matchResult = ttx.matchAll(/(pages\/[a-zA-Z0-9_]*.jpg)[^A-Z]*orgwidth="(\d*)" orgheight="(\d*)"/gm);
          const result = Array.from(matchResult).map(match => ({
            filename: match[1],
            width: parseInt(match[2]),
            height: parseInt(match[3]),
            src: `${config.contentServer}/${match[1]}/M_L.jpg`
          }));
          resolve(result.slice(0, result.length / 2));
        }
      });
    });
  } else { // tateyomi mode
    files = Array.from(document.querySelectorAll('.works_tateyomi__img img')).map(imgElement => imgElement.src);
  }

  const title1 = document.title.split('|').shift().replace('公式-', '').trim();
  let title0 = title1.replace(/(\?|\~|\/|\:|　)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            '　':' ',
            }[$1];
            });
  
  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: files.length,
    getImagePromises,
    title: title0,
  });
 
  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return files
      .slice(startNum - 1, endNum)
      .map(file => 
        (
          isBinbReader
          ? getDecryptedImage(file)
          : axios.get(file, { responseType: 'arraybuffer' }).then(res => res.data)
        )
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