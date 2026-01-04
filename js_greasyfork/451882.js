// ==UserScript==
// @name         WebnewtypeDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic.webnewtype.com
// @icon         https://comic.webnewtype.com/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451882-webnewtypedownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic.webnewtype.com/contents/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451882/WebnewtypeDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451882/WebnewtypeDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get title
  const titleElement = document.querySelector('.contents__ttl--comic');
  const title = titleElement ? titleElement.textContent.trim() : `pack_${Date.now()}`;

  // get URL of images
  const imageURLs = await axios({
    method: 'GET',
    url: `${window.location.origin}${window.location.pathname}json`
  }).then(res => res.data
    .flat()
    .filter(path => path.includes('.jpg'))
    .map(path => {
      const parts = path.split('/').filter(part => part !== '');
      parts.pop();
      return `${window.location.origin}/${parts.join('/')}`;
    }
  ));

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageURLs.length,
    getImagePromises,
    title,
    positionOptions: { top: '120px' }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageURLs
      .slice(startNum - 1, endNum)
      .map(url => axios
        .get(url, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader);