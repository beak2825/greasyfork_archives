// ==UserScript==
// @name         TongliDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.2
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for ebook.tongli.com.tw
// @icon         https://ebook.tongli.com.tw/images/logo_small.jpg
// @homepageURL  https://greasyfork.org/scripts/490917-tonglidownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://ebook.tongli.com.tw/reader/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490917/TongliDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/490917/TongliDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';

  // get book ID from href
  const bookID = new URL(window.location.href).searchParams.get('bookID');
  const freeTrialToken = new URL(window.location.href).searchParams.get('freeTrialToken');

  // get title and pages data
  let { title, pages } = await getConfig().then(config => ({
    title: config.Title,
    pages: config.Pages.sort((a, b) => a - b)
  }));

  // refresh pages' URL every 1 minute since it will expire in 2 minutes
  setInterval(async () => {
    pages = await getConfig().then(config => config.Pages.sort((a, b) => a - b));
  }, 60 * 1000);

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: pages.length,
    getImagePromises,
    title
  });

  // style fix
  document.getElementById('ImageDownloader-StartNumInput').style.color = '#000';
  document.getElementById('ImageDownloader-EndNumInput').style.color = '#000';

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return pages
      .slice(startNum - 1, endNum)
      .map(page => axios.get(page.ImageURL, { responseType: 'arraybuffer' })
        .then(res => res.data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get config data from API
  async function getConfig() {
    return await axios({
      method: 'GET',
      url: `https://api.tongli.tw/Comic/sas/${bookID}${freeTrialToken ? `?freeTrialToken=${freeTrialToken}` : ''}`,
      headers: { authorization: `Bearer ${await getAnonymousToken()}` }
    }).then(res => res.data);
  }

  // get anonymous token 
  async function getAnonymousToken() {
    await firebase.auth().signInAnonymously();
    const user = await new Promise(resolve => firebase.auth().onAuthStateChanged(resolve));
    return user.getIdToken(false);
  }

})(axios, JSZip, saveAs, ImageDownloader);