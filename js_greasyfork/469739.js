// ==UserScript==
// @name         WebAceDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for web-ace.jp
// @icon         https://web-ace.jp/img/pc/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451887-webacedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://web-ace.jp/*/contents/*/episode/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469739/WebAceDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469739/WebAceDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/web-ace\.jp\/.*\/contents\/.*\/episode\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // get url of images and title
  const urls = await axios.get(window.location.href + 'json').then(res => res.data.map(path => 'https://web-ace.jp' + path));
  const title1 = document.querySelector('div.container-headerArea h2').textContent;
  const title2 = document.querySelector('div.container-headerArea span').textContent;
  const title3 = document.querySelector('div.container-headerArea p').textContent;
  const title0 = `${title1} ${title2} ${title3}`;
  let title = title0.replace(/(\?|\~|\/|\:)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            }[$1];
            });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title,
    positionOptions: { top: '260px' }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
      .slice(startNum - 1, endNum)
      .map(url => axios.get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);
