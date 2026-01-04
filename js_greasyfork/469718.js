// ==UserScript==
// @name         AlphapolisDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.8
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for www.alphapolis.co.jp
// @icon         https://www.alphapolis.co.jp/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451858-alphapolisdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://www.alphapolis.co.jp/manga/official/*/*
// @match        https://www.alphapolis.co.jp/manga/*/*/episode/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/539610/1639733/ImageDownloaderLibla2.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/469718/AlphapolisDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469718/AlphapolisDownloader.meta.js
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
  const title1 = config.manga.title;
  const title2 = config.episode.mainTitle;
  const newtitle = `${title1} ${title2}`;
  let title = newtitle.replace(/(\?|\~|\/|\:)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            }[$1];
        });

 
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