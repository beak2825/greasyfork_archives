// ==UserScript==
// @name         ComicDaysDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-days.com and other sites using the same reader
// @icon         https://comic-days.com/images/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451861-comicdaysdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-days.com/*/*
// @match        https://shonenjumpplus.com/*/*
// @match        https://kuragebunch.com/*/*
// @match        https://www.sunday-webry.com/*/*
// @match        https://comicbushi-web.com/*/*
// @match        https://tonarinoyj.jp/*/*
// @match        https://comic-gardo.com/*/*
// @match        https://comic-zenon.com/*/*
// @match        https://comic-trail.com/*/*
// @match        https://comic-action.com/*/*
// @match        https://magcomi.com/*/*
// @match        https://viewer.heros-web.com/*/*
// @match        https://feelweb.jp/*/*
// @match        https://comicborder.com/*/*
// @match        https://comic-ogyaaa.com/*/*
// @match        https://comic-earthstar.com/*/*
// @match        https://comic-seasons.com/*/*
// @match        https://ichicomi.com/*/*
// @match        https://comic-y-ours.com/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451861/ComicDaysDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451861/ComicDaysDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = new RegExp(`${window.location.origin}/.*/.*`);
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

  // get JSON data of episode
  const jsonData = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.origin + window.location.pathname,
      responseType: 'text',
      headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1' },
      onload: res => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(res.response, 'text/html');
        resolve(JSON.parse(dom.querySelector('#episode-json').dataset.value));
      }
    });
  });

  // get url of images and title
  const imageURLs = jsonData.readableProduct.pageStructure.pages.filter(item => item.src).map(item => item.src);
  const title = jsonData.readableProduct.title;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => getImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  async function getImage(url) {
    const imageArrayBuffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);

    if (/\/\d\/\d+-[0-9a-f]{32}/.test(url)) {
      return new Promise(resolve => {
        const image = document.createElement('img');
        image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        image.onload = function () {
          // create canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = this.width;
          canvas.height = this.height;
          context.drawImage(this, 0, 0);

          const DIVIDE_NUM = 4,
                MULTIPLE = 8,
                cellWidth = Math.floor(canvas.width / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE,
                cellHeight = Math.floor(canvas.height / (DIVIDE_NUM * MULTIPLE)) * MULTIPLE;

          for (let e = 0; e < DIVIDE_NUM * DIVIDE_NUM; e++) {
            const t = Math.floor(e / DIVIDE_NUM) * cellHeight,
                  i = e % DIVIDE_NUM * cellWidth,
                  r = Math.floor(e / DIVIDE_NUM),
                  n = e % DIVIDE_NUM * DIVIDE_NUM + r,
                  s = n % DIVIDE_NUM * cellWidth,
                  o = Math.floor(n / DIVIDE_NUM) * cellHeight;
            context.drawImage(this, i, t, cellWidth, cellHeight, s, o, cellWidth, cellHeight);
          }

          canvas.toBlob(resolve, 'image/jpeg', 1);
        }
      });
    } else {
      return imageArrayBuffer;
    }
  }

})(axios, JSZip, saveAs, ImageDownloader);