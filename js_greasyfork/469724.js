// ==UserScript==
// @name         ComiciViewerDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader specific for Comici Viewer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youngchampion.jp
// @homepageURL  https://greasyfork.org/scripts/463181-comiciviewerdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://youngchampion.jp/episodes/*
// @match        https://younganimal.com/episodes/*
// @match        https://bigcomics.jp/episodes/*
// @match        https://kansai.mag-garden.co.jp/episodes/*
// @match        https://championcross.jp/episodes/*
// @match        https://comic-growl.com/episodes/*
// @match        https://comicpash.jp/episodes/*
// @match        https://rimacomiplus.jp/*/episodes/*
// @match        https://kimicomi.com/episodes/*
// @match        https://comic-medu.com/episodes/*
// @match        https://comicride.jp/*
// @match        https://comic.j-nbooks.jp/*
// @match        https://takecomic.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/539610/1639733/ImageDownloaderLibla2.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469724/ComiciViewerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469724/ComiciViewerDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  const alteredSites = ['comicride.jp', 'comic.j-nbooks.jp', 'takecomic.jp'];
  if (alteredSites.includes(window.location.host)) {
    // reload page when enter or leave chapter
    const re = new RegExp(`https://${window.location.host}/episodes/.*`);
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
  }

  // get episode id, API domain and title
  const { id, apiDomain, title2 } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const viewerElement = document.getElementById('comici-viewer');
      const titleElement = document.querySelector('.article-title') || document.querySelector('.ep-main > .ep-main-h > .ep-main-h-main > h1.ep-main-h-h');
      if (viewerElement && titleElement) {
        clearInterval(timer);
        resolve({
          id: viewerElement.getAttribute('comici-viewer-id') || viewerElement.dataset.comiciViewerId,
          apiDomain: (viewerElement.dataset.apiDomain.startsWith('/') ? window.location.host : '') + viewerElement.dataset.apiDomain,
          title2: titleElement.textContent.trim()
        });
      }
    }, 500);
  });

  const title1 = alteredSites.includes(window.location.host)
    ? document.querySelector('h1.series-h-title')?.innerText?.trim() || ''
    : document.querySelector('h1.series-h-title span')?.textContent?.trim() || '';
  const newtitle = `${title1} ${title2}`;
  let title = newtitle.replace(/(\?|\~|\/|\:)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            }[$1];
            });

  // get data of pages
  const userId = document.getElementById('login_user_id')?.textContent || document.getElementById('xAnalyticLoggerUid')?.textContent || '0';
  const pageCount = await axios.get(`https://${apiDomain}/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=0`).then(res => res.data.totalPages);
  const pages = await axios.get(`https://${apiDomain}/book/contentsInfo?user-id=${userId}&comici-viewer-id=${id}&page-from=0&page-to=${pageCount}`).then(res => res.data.result);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pageCount,
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

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(resolve => {
      const image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.src = data.imageUrl;
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0);

        // get scramble dict
        const dict = [];
        const dictTemplete = JSON.parse('[[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]');
        const scrambleOrders = JSON.parse(data.scramble);
        for (let i = 0; i < dictTemplete.length; i++) {
          dict.push(dictTemplete[scrambleOrders[i]]);
        }

        // start unscrambling
        const pieceWidth = Math.floor(data.width / 4);
        const pieceHeight = Math.floor(data.height / 4);
        let dictCounter = 0;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const x = dict[dictCounter][0];
            const y = dict[dictCounter][1];
            context.drawImage(this, pieceWidth * x, pieceHeight * y, pieceWidth, pieceHeight, pieceWidth * i, pieceHeight * j, pieceWidth, pieceHeight);
            dictCounter++;
          }
        }

        // output unscrambled image
        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
