// ==UserScript==
// @name         MangacrossDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for mangacross.jp
// @icon         https://mangacross.jp/img/favicon-96x96.png
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451872-mangacrossdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://mangacross.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469733/MangacrossDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469733/MangacrossDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/mangacross\.jp\/comics\/.*\/.*/;
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

  // get pages, volume and title from config
  const config = await axios.get(`${window.location.origin}${window.location.pathname}/viewer.json`).then(res => res.data);
  const { episode_pages: pages, volume, title } = config;
  const title0 = document.querySelector('div.comic-area div.comic-area-inner div.comic-detail-box h1.comic-area__title').textContent;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: `${title0} ${volume} ${title}`
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => axios.get(page.image.pc_url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);
