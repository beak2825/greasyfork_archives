// ==UserScript==
// @name         MangaParkDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for manga-park.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manga-park.com
// @homepageURL  https://greasyfork.org/scripts/455861-mangaparkdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://manga-park.com/title/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/455861/MangaParkDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455861/MangaParkDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // wait until a chapter is clicked, then get its chapter ID and title
  const { chapterId, title } = await new Promise(resolve => {
    const list = document.querySelector('.main-container .chapter > ul:has(> li[data-chapter-id])');
    list.addEventListener('click', listItemClickHandler);

    function listItemClickHandler(e) {
      // search list item with chapter ID
      let currentElement = e.target;
      while(true) {
        if (currentElement.tagName === 'LI' && currentElement.dataset.chapterId) {
          resolve({
            chapterId: currentElement.dataset.chapterId,
            title: currentElement.querySelector('.chapterTitle').textContent.trim()
          });
          break;
        } else {
          currentElement = currentElement.parentElement;
        }
      }

      // remove click event listener
      list.removeEventListener('click', listItemClickHandler);
    }
  });

  const successToOpenViewerPromise =  new Promise(resolve => {
    const timer = setInterval(() => {
      // if the close button of viewer appears, it means the viewer was successfully opened
      // then add click event listener to the close button
      const target = document.querySelector('.viewer .header .close');
      if (target) {
        target.addEventListener('click', () => window.location.reload());
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });

  const failToOpenViewerPromise =  new Promise(resolve => {
    const timer1 = setInterval(() => {
      const target = document.querySelector('.popup-container .popupTitle');

      // if the pop up container appears, it means the viewer was failed to open
      if (target.style.display !== 'none') {
        clearInterval(timer1);
        // then wait until the pop up container is closed
        const timer2 = setInterval(() => {
          if (target.style.display === 'none') {
            clearInterval(timer2);
            resolve(false);
          }
        }, 100);
      }
    }, 100);
  });

  // if fail to open viewer, reload the page
  const isSuccessToOpenViewer = await Promise.race([successToOpenViewerPromise, failToOpenViewerPromise]);
  if (!isSuccessToOpenViewer) window.location.reload();

  // collect data of image files
  const files = await axios({
    method: 'GET',
    url: `https://manga-park.com/api/chapter/${chapterId}`
  }).then(res => res.data.data.chapter.map(data => ({
    path: data.images[0].path,
    key: data.images[0].key
  })));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: files.length,
    getImagePromises,
    title
  });
  
  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return files
      .slice(startNum -1, endNum)
      .map(file => getDecryptedImage(file)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  async function getDecryptedImage(file) {
    const imageUint8Array = await axios.get(file.path, { responseType: 'arraybuffer' }).then(res => new Uint8Array(res.data));
    const parsedKey = getParsedKey(file.key);
    if (parsedKey) {
      for (let i = 0; i < imageUint8Array.length; i++) {
        imageUint8Array[i] ^= parsedKey[i % parsedKey.length];
      }
    }

    return new Blob([imageUint8Array], { type: 'image/jpeg' });
  }

  // get parsed key
  function getParsedKey(key) {
    const originString = window.atob(key);
    const result = new Uint8Array(new ArrayBuffer(originString.length));
    for (let i = 0; i < originString.length; i++) {
      result[i] = originString.charCodeAt(i);
    }

    return result;
  }

})(axios, JSZip, saveAs, ImageDownloader);