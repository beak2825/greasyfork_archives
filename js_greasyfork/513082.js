// ==UserScript==
// @name         DrecomMangaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for drecom-media.jp
// @icon         https://drecom-media.jp/favicon-32x32.png
// @homepageURL  https://greasyfork.org/scripts/513082-drecommangadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://drecom-media.jp/viewer/e/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513082/DrecomMangaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513082/DrecomMangaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // collect essential data
  const { title, pageAmount, cgi, param } = await new Promise(resolve => {
    const searchParams = new URLSearchParams(window.location.search);
    const isFromStudios = searchParams.has('cgi') && searchParams.has('param');
    const timer = setInterval(() => {
      const titleElement = document.querySelector('head title');
      const pageAmountElement = document.querySelector('[id*=nombre_total]');
      const cgi = isFromStudios ? searchParams.get('cgi') : document.querySelector('#meta input[name=cgi]')?.value;
      const param = isFromStudios ? searchParams.get('param') : document.querySelector('#meta input[name=param]')?.value;
      if (titleElement && titleElement.textContent && pageAmountElement && pageAmountElement.textContent && cgi && param) {
        clearInterval(timer);
        resolve({
          title: titleElement.textContent.split('|').shift().replace(/\s-\sDRE.*公式サイト\s/, ''),
          pageAmount: parseInt(pageAmountElement.textContent),
          cgi: (isFromStudios ? 'https://drecom-media.jp' : '') + cgi,
          param: encodeURIComponent(param),
        });
      }
    }, 200);
  });

  // get encrypted image data
  const encryptedImageData = Array(pageAmount).fill('').map((_, index) => ({
    imageURL: `${cgi}?mode=1&file=${String(index).padStart(4, '0')}_0000.bin&reqtype=0&param=${param}`,
    dictURL: `${cgi}?mode=8&file=${String(index).padStart(4, '0')}.xml&reqtype=0&param=${param}`
  }));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: encryptedImageData.length,
    getImagePromises,
    title
  });

  // collect promises of decrypted image
  function getImagePromises(startNum, endNum) {
    return encryptedImageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(resolve => {
      const encryptedImage = document.createElement('img');
      encryptedImage.src = data.imageURL;
      encryptedImage.onload = async function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        // get scramble dict
        const dict = await axios({
          method: 'GET',
          url: data.dictURL
        }).then(res => res.data
          .match(/<Scramble>(?<dict>.*)<\/Scramble>/).groups.dict
          .split(',')
          .map(digit => parseInt(digit))
        );

        // draw pieces on correct position
        const pieceWidth = 8 * Math.floor(Math.floor(this.width / 4) / 8);
        const pieceHeight = 8 * Math.floor(Math.floor(this.height / 4) / 8)
        for (let i = 0; i < dict.length; i++) {
          const srcX = dict[i] % 4 * pieceWidth;
          const srcY = Math.floor(dict[i] / 4) * pieceHeight;
          const destX = i % 4 * pieceWidth;
          const destY = Math.floor(i / 4) * pieceHeight;
          context.drawImage(this, srcX, srcY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);