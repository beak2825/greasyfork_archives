// ==UserScript==
// @name         AlphapolisDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.8
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.alphapolis.co.jp
// @icon         https://www.alphapolis.co.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451858-alphapolisdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.alphapolis.co.jp/manga/official/*/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451858/AlphapolisDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451858/AlphapolisDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get config
  const config = await axios({
    method: 'POST',
    url: 'https://www.alphapolis.co.jp/manga/official/viewer.json',
    data: {
      episode_no: window.location.pathname.split('/').at(-1),
      manga_sele_id: window.location.pathname.split('/').at(-2),
      hide_page: false,
      preview: false,
      resolution: 'full_hd'
    }
  }).then(res => res.data);

  // get title
  const title = config.episode.title;

  // get url of images
  const urls = config.page.images.map(image => image.url);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: urls.length,
    getImagePromises,
    title
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return urls
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

})(axios, JSZip, saveAs, ImageDownloader);