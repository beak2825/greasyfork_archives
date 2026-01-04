// ==UserScript==
// @name         ComicBoostDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.6
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for comic-boost.com
// @icon         https://cdn.comic-boost.com/contents/img/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451860-comicboostdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://comic-boost.com/viewer/viewer.html*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @require      https://greasyfork.org/scripts/451811-publusconfigdecoder/code/PublusConfigDecoder.js?version=1096709
// @require      https://greasyfork.org/scripts/451814-publuspage/code/PublusPage.js?version=1159347
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469719/ComicBoostDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469719/ComicBoostDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage) {
  'use strict';

  // reload page when enter or leave episode
  const re = /https:\/\/comic-boost\.com\/viewer\/.*/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (newHref === oldHref) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);

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

  // get title
  const title = authData.cti;
  const newtitle = title.split(' - ').reverse().join(" ");

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title: `${newtitle}`,
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