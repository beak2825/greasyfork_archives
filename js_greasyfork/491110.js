// ==UserScript==
// @name         MangaMeetsDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.2
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for manga-meets.jp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manga-meets.jp
// @homepageURL  https://greasyfork.org/scripts/491110-mangameetsdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://*.manga-meets.jp/comics/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491110/MangaMeetsDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/491110/MangaMeetsDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/(.*\.)?manga-meets\.jp\/comics\/.*/;
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

  // get title and url of images
  const [comicID, episodeID] = window.location.pathname.replace('/comics/', '').split('/');
  const config = await axios.get(`https://manga-meets.jp/api/comics/${comicID}/episodes/${episodeID}/viewer.json`).then(res => res.data);
  const title =  `${config.comic.title} ${config.volume || ''}${(config.volume && config.title) ? ' ' : ''}${config.title || ''}`;
  const imageURLs = config.episode_pages.map(page => page.image.original_url.replace('f_auto', 'w_1080'));

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
      .map(url => axios.get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);