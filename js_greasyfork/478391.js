// ==UserScript==
// @name         ZerosumonlineDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.4
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for zerosumonline.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zerosumonline.com
// @homepageURL  https://greasyfork.org/zh-CN/scripts/478375-zerosumonlinedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://zerosumonline.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/539610/1639733/ImageDownloaderLibla2.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/478391/ZerosumonlineDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/478391/ZerosumonlineDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // reload page when enter or leave chapter
  const re = /https:\/\/zerosumonline\.com\/episode\/.*\/chapter\/.*/;
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

  // get chapter ID
  const chapterId = await new Promise(resolve => {
    const timer = setInterval(() => {
      if (unsafeWindow.self && unsafeWindow.self.__next_f) {
        clearInterval(timer);
        resolve(unsafeWindow.self.__next_f.flat().join('').match(/"decodedChapterId":"(?<id>\d+)"/).groups.id);
      }
    }, 200);
  });

  // get title and urls
  const title0 = document.title.split('|')[1] + ' ' + document.title.split('|')[0];
  let title = title0.replace(/(\?|\~|\/)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            ':':'：',
            '/':'／'
            }[$1];
            });
  const imageURLs = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
          method: "POST",
          url: `https://api.zerosumonline.com/api/v1/viewer?chapter_id=${chapterId}`,
          onload: function(res) {
              if (res.status >= 200 && res.status < 300) {
                  const matchResult = res.responseText.match(/https:\/\/contents\.zerosumonline\.com\/chapter_page\/\d+\/\d+\.webp/g);
                  resolve(Array.from(matchResult || []));
              } else {
                  reject(res.statusText);
              }
          },
          onerror: reject
      });
  });

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