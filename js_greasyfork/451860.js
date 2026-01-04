// ==UserScript==
// @name         ComicBoostDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.7
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-boost.com
// @icon         https://cdn.comic-boost.com/contents/img/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451860-comicboostdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-boost.com/viewer/viewer.html*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451811/1096709/PublusConfigDecoder.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451860/ComicBoostDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451860/ComicBoostDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage) {
  'use strict';

  // get cid
  const cid = new URL(window.location.href).searchParams.get('cid');

  // get config data
  const authData = await axios.get(`https://comic-boost.com/pageapi/viewer/c.php?cid=${encodeURIComponent(cid)}`).then(res => res.data);
  const encodedConfig = await axios.get(`${authData.url}configuration_pack.json`).then(res => res.data);
  const decodedConfig = PublusConfigDecoder.decode(JSON.stringify(encodedConfig));

  // get data of images
  const pages = decodedConfig[0].configuration.contents.map(pageInfo => {
    const pageConfig = decodedConfig[0][pageInfo.file];
    return PublusPage.init(pageInfo.index, pageInfo.file, pageConfig, axios, decodedConfig[4], decodedConfig[5], decodedConfig[6], authData.url);
  }).flat();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: authData.cti,
    imageSuffix: 'jpeg',
    zipOptions: { base64: true }
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => page.getImage()
        .then(imageBase64 => imageBase64.replace('data:image/jpeg;base64,', ''))
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage);