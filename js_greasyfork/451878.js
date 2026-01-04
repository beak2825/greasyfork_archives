// ==UserScript==
// @name         PublusDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader specific for Publus reader
// @icon         https://images.pash-up.jp/contents/img/common/icon.ico
// @homepageURL  https://greasyfork.org/scripts/451878-publusdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.comicnettai.com/*/viewer.html*
// @match        https://pash-up.jp/*/viewer.html*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451811/1096709/PublusConfigDecoder.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451878/PublusDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451878/PublusDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage) {
  'use strict';

  // prepare basic URL of API
  const apiDict = {
    'https://pash-up.jp': 'https://pash-up.jp/pageapi/viewer/c.php',
    'https://www.comicnettai.com': 'https://www.comicnettai.com/api/viewer/c'
  }

  // get config
  const cURL = apiDict[window.location.origin] + window.location.search;
  const cData = await axios.get(cURL).then(res => res.data);
  const encodedConfig = await axios.get(`${cData.url}configuration_pack.json`).then(res => res.data);
  const decodedConfig = PublusConfigDecoder.decode(JSON.stringify(encodedConfig));

  // prepare pages
  const configuration = decodedConfig[0].configuration;
  const pages = configuration.contents.map(pageInfo => {
    const pageConfig = decodedConfig[0][pageInfo.file];
    return PublusPage.init(pageInfo.index, pageInfo.file, pageConfig, axios, decodedConfig[4], decodedConfig[5], decodedConfig[6], cData.url);
  });

  // prepare title
  const title = await new Promise(resolve => {
    const timer = setInterval(() => {
      const titleElement = document.querySelector('#pagetitle .titleText');
      if (titleElement && titleElement.textContent) {
        resolve(titleElement.textContent.replaceAll('/', ' '));
        clearInterval(timer);
      }
    }, 200);
  });

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title,
    imageSuffix: 'jpeg',
    zipOptions: { base64: true }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => page.getImage(cData.auth_info)
        .then(imageBase64 => imageBase64.replace('data:image/jpeg;base64,', ''))
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage);