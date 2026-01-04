// ==UserScript==
// @name         BookwalkerDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.8
// @license      GPL-3.0
// @author       Timesient
// @description  Manga and novel downloader for bookwalker.jp
// @icon         https://bookwalker.jp/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451859-bookwalkerdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://viewer.bookwalker.jp/*/*/viewer.html*
// @match        https://viewer-subscription.bookwalker.jp/*/*/viewer.html*
// @match        https://pcreader.bookwalker.com.tw/*/*/viewer.html*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451811/1096709/PublusConfigDecoder.js
// @require      https://update.greasyfork.org/scripts/451814/1159347/PublusPage.js
// @require      https://update.greasyfork.org/scripts/451813/1128858/PublusNovelPage.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451859/BookwalkerDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451859/BookwalkerDownloader.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage, PublusNovelPage) {
  'use strict';
  
  // collect parameters for API requests
  const cid = new URL(window.location.href).searchParams.get('cid');
  const BID = window.localStorage['NFBR.Global/BrowserId'];
  const cr = await new Promise(async resolve => {
    const targetScriptURL = document.querySelector('script[src$=getLoader]').src;
    const scriptString = await axios.get(targetScriptURL).then(res => res.data);
    const functionBodyString = scriptString.match(/function\(\)\{(?<body>let.*'\d{4,}';)\}/).groups.body;
    resolve(new Function(functionBodyString)());
  });

  // get auth data by API
  const apiURL = ({
    'viewer.bookwalker.jp': `https://viewer.bookwalker.jp/browserWebApi/c?cid=${cid}&BID=${BID}&cr=${cr}`,
    'viewer-subscription.bookwalker.jp': `https://viewer-subscription.bookwalker.jp/browserWebApi3/c?cid=${cid}&BID=${BID}&cr=${cr}`,
    'pcreader.bookwalker.com.tw': `https://pcreader.bookwalker.com.tw/browserWebApi/c?cid=${cid}&BID=${BID}&cr=${cr}`
  })[window.location.host];
  
  // get auth data, and renew it every 30 seconds, since it will expire in 60 seconds
  let authData = await axios.get(apiURL).then(res => res.data);
  setInterval(async () => {
    authData = await axios.get(apiURL).then(res => res.data);
  }, 30 * 1000);

  // get pages  
  const { encodedConfig, isNovel } = await Promise.any([getEncodedConfig(''), getEncodedConfig('normal_default/')]);
  const decodedConfig = PublusConfigDecoder.decode(JSON.stringify(encodedConfig));
  const pages = decodedConfig[0].configuration.contents.map(pageInfo => {
    const pageConfig = decodedConfig[0][pageInfo.file];
    return (isNovel ? PublusNovelPage : PublusPage).init(pageInfo.index, pageInfo.file, pageConfig, axios, decodedConfig[4], decodedConfig[5], decodedConfig[6], authData.url);
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
      .map(page => page.getImage(authData.auth_info)
        .then(imageBase64 => imageBase64.replace('data:image/jpeg;base64,', ''))
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of encoded config
  function getEncodedConfig(addon) {
    return axios({
      method: 'GET',
      url: `${authData.url}${addon}configuration_pack.json?cfg=1&${new URLSearchParams(authData.auth_info)}`
    }).then(res => ({
      encodedConfig: res.data,
      isNovel: addon === 'normal_default/'
    }));
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusConfigDecoder, PublusPage, PublusNovelPage);