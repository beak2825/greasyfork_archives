// ==UserScript==
// @name         NicoMangaSpDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for sp.manga.nicovideo.jp
// @icon         https://manga.nicovideo.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/468131-nicomangaspdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://sp.manga.nicovideo.jp/watch/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468131/NicoMangaSpDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/468131/NicoMangaSpDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get episode ID
  const episodeID = window.location.pathname.split('/').pop().replace('mg', '');

  // get title
  const title = await axios.get(`https://api.nicomanga.jp/api/v1/app/manga/episodes/${episodeID}`).then(res => res.data.data.result.meta.title);

  // get pages
  const pages = await axios.get(`https://api.nicomanga.jp/api/v1/app/manga/episodes/${episodeID}/frames?enable_webp=true`).then(res => res.data.data.result);

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
      .map(page => getImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of image
  function getImage(page) {
    return new Promise(async resolve => {
      const { source_url: url, drm_hash: hash } = page.meta;
      let imageArrayBuffer = await new Promise(_resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'arraybuffer',
          onload: res => _resolve(res.response)
        });
      });

      if (hash) imageArrayBuffer = xor(imageArrayBuffer, generateKey(hash));

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve);
      }
    });

    function generateKey(e) {
      const t = e.slice(0, 16).match(/[\da-f]{2}/gi);
      return new Uint8Array(t.map((e => parseInt(e, 16))))
    }

    function xor(e, t) {
      const n = new Uint8Array(e)
        , { length: r } = n
        , { length: a } = t
        , l = new Uint8Array(r);
      for (let e = 0; e < r; e += 1)
          l[e] = n[e] ^ t[e % a];
      return l;
    }
  }

})(axios, JSZip, saveAs, ImageDownloader);