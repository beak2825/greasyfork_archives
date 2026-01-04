// ==UserScript==
// @name         ComicWalkerDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.0
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-walker.com
// @icon         https://comic-walker.com/favicons/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451866-comicwalkerdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-walker.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451866/ComicWalkerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451866/ComicWalkerDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/comic-walker\.com\/detail\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading episode now
  if (!re.test(oldHref)) return;

  // wait until dataLayer generated
  await new Promise(resolve => {
    const timer = setInterval(() => {
      if (unsafeWindow.dataLayer) clearInterval(timer), resolve();
    }, 200);
  });

  // collect episode data
  const {
    episode_title: title,
    content_id: workCode,
    episode_id: episodeCode
  } = unsafeWindow.dataLayer.filter(item => item.episode_title || item.content_id || item.episode_id).reduce((acc, cur) => Object.assign(acc, cur), {});

  // jump to current episode page when failed to get episode data
  if (!(title && workCode && episodeCode)) {
    const currentEpisodeHref = document.querySelector('li > a[class*=EpisodeThumbnail_isReading]')?.href;
    if (currentEpisodeHref) window.location.href = currentEpisodeHref;
    return;
  }  

  // get pages
  const episodeID = await axios.get(`https://comic-walker.com/api/contents/details/episode?workCode=${workCode}&episodeCode=${episodeCode}&episodeType=latest`).then(res => res.data.episode.id);
  const pages = await axios.get(`https://comic-walker.com/api/contents/viewer?episodeId=${episodeID}&imageSizeType=width%3A1284`).then(res => res.data.manuscripts);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title
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

  // get promise of decrypted image
  function getDecryptedImage(page) {
    return new Promise(async resolve => {
      const sourceURL = page.drmImageUrl;
      const key = generateKey(page.drmHash);
      const encryptedBuffer = await axios.get(sourceURL, { responseType: 'arraybuffer' }).then(res => new Uint8Array(res.data));
      const decryptedBuffer = new Uint8Array(encryptedBuffer.length);
      for (let i = 0; i < encryptedBuffer.length; i++) {
        decryptedBuffer[i] = encryptedBuffer[i] ^ key[i % key.length];
      }
      
      const image = document.createElement('img');
      image.src = URL.createObjectURL(new Blob([decryptedBuffer]));
      image.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(resolve);
      }
    });
  }

  // generate key map
  function generateKey(hash) {
    const parts = hash.slice(0, 16).match(/[\da-f]{2}/gi);
    return new Uint8Array(parts.map(part => parseInt(part, 16)));
  }

})(axios, JSZip, saveAs, ImageDownloader);