// ==UserScript==
// @name         YnjnDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.8
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for ynjn.jp
// @icon         https://public.ynjn.jp/web/img/common/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/455206-ynjndownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://ynjn.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455206/YnjnDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455206/YnjnDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // show info in title page
  const infoElement = document.createElement('span');
  infoElement.textContent = `Please open a chapter to download`;
  infoElement.style = `position: fixed; top: 144px; left: 72px; z-index: 999999999; padding: 8px; height: 36px; display: none; justify-content: center; align-items: center; font-size: 14px; font-family: Consolas, Monaco, "Microsoft YaHei"; background-color: #0984E3; color: #ffffff; border-radius: 4px;`;
  document.body.appendChild(infoElement);
  setInterval(() => { infoElement.style.display = /https:\/\/ynjn\.jp\/title\/\d+/.test(window.location.href) ? 'flex' : 'none'; }, 1000);

  // reload page when enter or leave chapter
  const re = /https:\/\/ynjn\.jp\/viewer\/\d+\/\d+/;
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

  // get title and pages
  const { title_id, episode_id } = window.location.href.match(/viewer\/(?<title_id>\d+)\/(?<episode_id>\d+)/).groups;
  const config = await axios.get(`https://webapi.ynjn.jp/viewer?title_id=${title_id}&episode_id=${episode_id}`).then(res => res.data.data);
  const title = config.viewer_navigation.name;
  const pages = config.pages.filter(page => page.manga_page).map(page => page.manga_page);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title,
    imageSuffix: 'png'
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get decrypted image
  function getDecryptedImage(page) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: page.page_image_url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = page.image_horizontal_size;
        canvas.height = page.image_vertical_size;

        // draw pieces on correct position
        const pieceWidth = Math.floor(this.width / 4);
        const pieceHeight = Math.floor(this.height / 4);
        for (let i = 0; i < 16; i++) {
          let srcX = i % 4 * pieceWidth;
          let srcY = Math.floor(i / 4) * pieceHeight;
          let j = i % 4 * 4 + Math.floor(i / 4);
          let destX = j % 4 * pieceWidth;
          let destY = Math.floor(j / 4) * pieceHeight;
          ctx.drawImage(this, srcX, srcY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);