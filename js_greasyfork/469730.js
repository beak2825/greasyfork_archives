// ==UserScript==
// @name         IchijinPlusDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for ichijin-plus.com
// @icon         https://ichijin-plus.com/brand_icons/icon_32x32.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/455783-ichijinplusdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://ichijin-plus.com/episodes/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469730/IchijinPlusDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469730/IchijinPlusDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/ichijin-plus\.com\/episodes\/.*/;
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

  // get episode data by API
  const episodeData = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://api.ichijin-plus.com${window.location.pathname}/begin_reading`,
      responseType: 'json',
      headers: { 'x-api-environment-key': 'GGXGejnSsZw-IxHKQp8OQKHH-NDItSbEq5PU0g2w1W4=' },
      onload: res => resolve(res.response)
    });
  });

  if (!episodeData) {
    window.alert("Manga Downloader:\nCannot get data, may be you should check the value of 'x-api-environment-key' in request headers");
    return;
  }

  const title1 = episodeData.comic_title;
  const title2 = episodeData.episode_title;
  const encryptedImageData = episodeData.pages.map(page => ({ url: page.page_image_url, hash: page.drm_hash }));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: encryptedImageData.length,
    getImagePromises,
    title: `${title1} ${title2}`,
  });

  // collect promises of image
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
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function() {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;

        const dict = window.atob(data.hash).split('').map(char => char.charCodeAt(0));
        let i = dict[0],
            o = dict[1],
            a = dict.slice(2),
            s = this.width,
            u = this.height,
            l = Math.floor((s - s % 8) / i),
            f = Math.floor((u - u % 8) / o);

        for (let j = 0; j < i * o; j += 1) {
          let h = a[j],
              p = h % i,
              m = Math.floor(h / i),
              g = j % i,
              v = Math.floor(j / i);

          ctx.drawImage(this, p * l, m * f, l, f, g * l, v * f, l, f);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);