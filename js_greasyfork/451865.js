// ==UserScript==
// @name         ComicoDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      1.0
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comico.jp, comico.kr and pocketcomics.com
// @icon         https://www.comico.jp/favicon/comico/favicon-32x32.png
// @homepageURL  https://greasyfork.org/scripts/451865-comicodownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.comico.jp/*
// @match        https://www.comico.kr/*
// @match        https://www.pocketcomics.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://unpkg.com/crypto-js@4.1.1/crypto-js.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451865/ComicoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451865/ComicoDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, CryptoJS, ImageDownloader) {
  'use strict';

  // determine regexp according to the host
  const re = ({
    'www.comico.jp': /https:\/\/www\.comico\.jp\/(comic|magazine_comic)\/\d+\/chapter\/\d+\/.*/,
    'www.comico.kr': /https:\/\/www\.comico\.kr\/comic\/\d+\/chapter\/\d+\/.*/,
    'www.pocketcomics.com': /https:\/\/www\.pocketcomics\.com\/comic\/\d+\/chapter\/\d+\/.*/
  })[window.location.host];

  // reload page when enter or leave chapter
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

  // collect essential parameters
  const jsPathname = document.querySelector('link[rel=modulepreload]').getAttribute('href');
  const webKey = await axios.get(`${window.location.origin}${jsPathname}`).then(res => res.data.match(/"(?<key>[0-9a-f]{32})"\+[a-z]{1}\+[a-z]{1}/).groups.key);
  const timestamp = Math.round(Date.now() / 1000);
  const checkSum = CryptoJS.SHA256(webKey + '0.0.0.0' + timestamp).toString(CryptoJS.enc.Hex);

  // get data of current episode
  const episodeData = await axios({
    method: 'GET',
    url: `${window.location.origin.replace('www', 'api')}${window.location.pathname}`,
    withCredentials: true,
    headers: {
      'Accept-Language': 'ja-JP',
      'X-comico-check-sum': checkSum,
      'X-comico-client-accept-mature': 'Y',
      'X-comico-client-immutable-uid': '0.0.0.0',
      'X-comico-client-os': 'other',
      'X-comico-client-platform': 'web',
      'X-comico-client-store': 'other',
      'X-comico-request-time': timestamp,
      'X-comico-timezone-id': 'Asia/Hong_Kong'
    }
  }).then(res => res.data.data.chapter);

  // get url of images
  let imageURLs;
  const isMagazineComic = window.location.pathname.includes('magazine_comic');
  if (isMagazineComic) {
    const epubConfig = episodeData.epub.chapterEpubIncludedFile;
    imageURLs = await axios({
      method: 'GET',
      url: `${AESDecoder(epubConfig.url)}${epubConfig.rootPath}${epubConfig.rootFileName}?${epubConfig.parameter}`,
      responseType: 'text'
    }).then(res => {
      const xmlDocument = (new DOMParser()).parseFromString(res.data, 'text/xml');
      return Array
        .from(xmlDocument.querySelectorAll('item[media-type="image/jpeg"]'))
        .map(item => `${AESDecoder(epubConfig.url)}${epubConfig.rootPath}${item.getAttribute('href')}${epubConfig.m2Parameter.optimize}?${epubConfig.parameter}`);
    });
  } else {
    imageURLs = episodeData.images.map(image => `${AESDecoder(image.url)}?${image.parameter}`);
  }

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title: episodeData.name
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
  function getImage(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

  // decode texts
  function AESDecoder(text) {
    const key = CryptoJS.enc.Utf8.parse('a7fc9dc89f2c873d79397f8a0028a4cd');
    const options = { mode: CryptoJS.mode.CBC };
    if (isMagazineComic) {
      options.iv = CryptoJS.enc.Utf8.parse('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
      options.padding = CryptoJS.pad.Pkcs7;
    } else {
      options.iv = CryptoJS.enc.Utf8.parse(CryptoJS.enc.Hex.parse(''));
    }
    return CryptoJS.AES.decrypt(text, key, options).toString(CryptoJS.enc.Utf8);
  }

})(axios, JSZip, saveAs, CryptoJS, ImageDownloader);