// ==UserScript==
// @name         JumptoonDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.3
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for jumptoon.com
// @icon         https://jumptoon.com/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/497457-jumptoondownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://jumptoon.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/497457/JumptoonDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/497457/JumptoonDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/jumptoon\.com\/series\/.*\/episodes\/(?<episodeID>\d+)\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (re.exec(newHref)?.groups?.episodeID === re.exec(oldHref)?.groups?.episodeID) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // get episode content
  unsafeWindow.__userscript_temp__ = [];
  const functionBodyString = Array
    .from(document.querySelectorAll('script'))
    .filter(element => element.textContent.includes('seriesEpisodeContent'))
    .pop()
    .textContent
    .replace('self.__next_f.push', 'window.__userscript_temp__.push');
  new Function(functionBodyString)();
  const contentString = unsafeWindow.__userscript_temp__.pop().pop();
  const content = JSON.parse(contentString.slice(contentString.indexOf('[['))).shift().pop().seriesEpisodeContent;

  // get title & pages & seed
  const title = `${content.seriesEpisodeEdge.node.notation}${content.seriesEpisodeEdge.node.title ? ' ' + content.seriesEpisodeEdge.node.title : ''}`;
  const pages = content.pageList;
  const seed = `${content.seriesId}:${content.number}`.split('').reduce((acc, cur) => acc + cur.codePointAt(0), 0);
  const scrambleAlgorithmType = content.scrambleAlgorithmType;

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title
  });

  // add style patch
  const downloadBtn = document.getElementById('ImageDownloader-DownloadButton');
  if (downloadBtn) downloadBtn.style.textAlign = 'center';

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
      const imageArrayBuffer = await axios.get(page.imageUrl, { responseType: 'arraybuffer' }).then(res => res.data);
      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = page.width;
        canvas.height = page.height;

        // get coords
        const coords = getCoords(seed, scrambleAlgorithmType, page.width, this.width, page.height);

        // draw pieces
        for (const coord of coords) {
          ctx.drawImage(this, ...coord);
        }

        canvas.toBlob(resolve);
      }
    });
  }

  // seed, scrambleAlgorithmType, page.width, scrambledImage.width, page.height
  function getCoords(e, i, t, s, r) { 
    const X = (e) => ({
      next: () => e = (1664525 * e + 1013904223) % 4294967296
    });

    const e4 = (e, i, t) => {
      let s = Array.from({ length: i}, (e, i) => i)
        , r = i;
      0 !== t && r--;
      let a = X(e);
      for (let e = r; e > 1; e--) {
        let i = a.next() % e;
        [s[i],s[e - 1]] = [s[e - 1], s[i]]
      }
      return s;
    }

    const eQ = {
      V1: {
        splitWidth: 12,
        paddingWidth: 3,
        blankWidth: 3
      },
      V2: {
        splitWidth: 20,
        paddingWidth: 15,
        blankWidth: 1
      }
    }

    let {splitWidth: a, blankWidth: n, paddingWidth: o} = eQ[i]
      , l = a + n + 2 * o
      , d = Math.floor(s / l)
      , c = t % a
      , u = e4(e, d, c)
      , m = Array.from({ length: d })
      , p = [];
    for (let e of u)
      m[u[e]] = e;
    for (let e = 0; e < d; e++) {
      let i = m[e] * l + o
        , t = e * a;
      p.push([i, 0, a, r, t, 0, a, r])
    }
    if (c) {
      let e = d * l + o
        , i = d * a;
      p.push([e, 0, c, r, i, 0, c, r])
    }
    return p;
  }

})(axios, JSZip, saveAs, ImageDownloader);