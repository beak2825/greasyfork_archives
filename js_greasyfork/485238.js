// ==UserScript==
// @name         DREDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.1
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for drecom-media.jp
// @icon         https://drecom-media.jp/icons/drecomics/favicon.ico?id=34f645e8de937e1ffcb33e30e429b6d0
// @homepageURL  https://greasyfork.org/zh-CN/scripts/485238-dredownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://drecom-media.jp/viewer/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/485238/DREDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/485238/DREDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/drecom-media\.jp\/viewer\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // collect essential data
  const { title, cgi, param, pageAmount } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const titleElement = document.querySelector('head title');
      const cgiElement = document.querySelector('#meta input[name=cgi]');
      const paramElement = document.querySelector('#meta input[name=param]');
      const pageAmountElement = document.getElementById('menu_nombre_total');
      if (
        titleElement &&
        titleElement.textContent &&
        cgiElement &&
        paramElement &&
        pageAmountElement &&
        pageAmountElement.textContent
      ) {
        clearInterval(timer);
        resolve({
          title: titleElement.textContent.split(' - DRE')[0].trim(),
          cgi: cgiElement.value,
          param: encodeURIComponent(paramElement.value),
          pageAmount: parseInt(pageAmountElement.textContent)
        });
      }
    }, 200);
  });

  const newtitle = title.split(' - ').join(" ");
  let lasttitle = newtitle.replace(/(\?|\~|\/|\:|\<|\>)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            '<':'＜',
            '>':'＞',
            }[$1];
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
    title: `${lasttitle}`,
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
