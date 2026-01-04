// ==UserScript==
// @name         KindleMangaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.9
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for read.amazon.co.jp
// @icon         https://m.media-amazon.com/images/G/01/kfw/mobile/kindle_favicon.png
// @homepageURL  https://greasyfork.org/scripts/451870-kindlemangadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://read.amazon.co.jp/manga/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451870/KindleMangaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451870/KindleMangaDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // collect essential data
  const { bookInfo, pageAmount } = await new Promise(resolve => {
    const timer = setInterval(() => {
      const target1 = document.querySelector('#bookInfo');
      const target2 = document.querySelector('#pageInfoCurrentPage');
      const target3 = document.querySelector('#pageInfoTotalPage');
      if (target1 && target2 && target3 && parseInt(target2.textContent) !== 0 && parseInt(target3.textContent) !== 1) {
        clearInterval(timer);
        resolve({
          bookInfo: JSON.parse(target1.textContent),
          pageAmount: parseInt(target3.textContent)
        });
      }
    }, 200);
  });

  // build parameters
  const params = {
    version: '3.0',
    asin: bookInfo.asin,
    contentType: 'FullBook',
    revision: bookInfo.contentGuid,
    fontFamily: 'Bookerly',
    fontSize: 4.95,
    lineHeight: 1.4,
    dpi: 160,
    height: 923,
    width: 400,
    maxNumberColumns: 2,
    theme: 'dark',
    packageType: 'TAR',
    numPage: -1 * pageAmount,
    skipPageCount: pageAmount,
    startingPosition: 0,
    token: bookInfo.karamelToken.token
  }

  // show progress info
  const infoElement = document.createElement('div');
  infoElement.style = `position: fixed; top: 72px; left: 72px; z-index: 999999999; height: 48px; padding: 0 16px; display: flex; justify-content: center; align-items: center; font-size: 14px; font-family: Consolas, Monaco, "Microsoft YaHei"; background-color: #0984E3; color: #FFFFFF; border-radius: 4px;`;
  infoElement.textContent = `Collected Pages: 0`;
  document.body.appendChild(infoElement);

  // get pages
  let pages = [];
  for (let i = 0; i < Math.ceil(pageAmount / 100); i++) {
    const newPages = await getPages({ ...params, numPage: -100, skipPageCount: (i + 1) * 100 });
    pages = [].concat(pages, newPages.filter(newPage => !pages.find(page => page.url === newPage.url)));
    infoElement.textContent = `Collected Pages: ${pages.length}`;
  }

  const lastPage = await getPages({ ...params, numPage: 1 });
  pages = [].concat(pages, lastPage);
  infoElement.remove();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: bookInfo.title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => getDecryptedImage(page)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      )
  }

  // get decrypted image
  async function getDecryptedImage(page) {
    const src = `${page.baseUrl}/${page.url}?${page.authParameter}&token=${encodeURIComponent(bookInfo.karamelToken.token)}&expiration=${encodeURIComponent(bookInfo.karamelToken.expiresAt)}`;
    const encryptedBuffer = await fetch(src).then(res => res.arrayBuffer());
    const decryptedBuffer = await getDecryptedBuffer(encryptedBuffer, bookInfo.karamelToken);
    return new Blob([decryptedBuffer]);
  }

  async function getDecryptedBuffer(t, e) {
    const n = new TextDecoder('utf-8');
    const o = new TextEncoder;
    const r = n.decode(t);
    const a = r.slice(0, 24);
    const c = r.slice(24, 48);
    const h = r.slice(48, r.length);
    const l = base64StringToArrayBuffer(a);
    const d = base64StringToArrayBuffer(c);
    const u = base64StringToArrayBuffer(h);
    const g = getKey(e);
    const v = await window.crypto.subtle.importKey("raw", o.encode(g), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
    const p = await window.crypto.subtle.deriveKey({ name: "PBKDF2", salt: l, iterations: 1e3, hash: "SHA-256" }, v, { name: "AES-GCM", length: 128 }, false, ["decrypt"]);
    
    return await window.crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: d,
      additionalData: o.encode(g.slice(0, 9)),
      tagLength: 128
    }, p, u);
  }
  
  function base64StringToArrayBuffer(base64) {
    const origin = window.atob(base64);
    const result = new Uint8Array(origin.length);
    for (let i = 0; i < origin.length; i++) {
      result[i] = origin.charCodeAt(i);
    }
    return result.buffer;
  }
  
  function getKey(t) {
    if (t.token.length < 100) throw new Error('error in getKey');
    const i = t.expiresAt % 60;
    return t.token.substring(i, i + 40);
  }

  // request pages from API
  async function getPages(params) {
    const apiURL = `https://read.amazon.co.jp/renderer/render?${new URLSearchParams(params)}`;
    const tarString = await axios.get(apiURL).then(res => res.data.replaceAll('\u0000', ''));
    const manifest = JSON.parse(`{` + tarString.match(/"cdnResources".*"acr"/)[0] + `: "acr content" }`);
    return manifest.cdnResources.map(page => {
      page.baseUrl = manifest.cdn.baseUrl;
      page.authParameter = manifest.cdn.authParameter;
      page.order = parseInt(page.url.replace('resource/rsrc', ''), 36);
      return page;
    }).sort((a, b) => a.order - b.order);
  }

})(axios, JSZip, saveAs, ImageDownloader);