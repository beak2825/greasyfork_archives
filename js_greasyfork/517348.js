// ==UserScript==
// @name         GanmaDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.9
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for ganma.jp
// @icon         https://ganma.jp/web/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451869-ganmadownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://ganma.jp/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/517348/GanmaDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/517348/GanmaDownloader.meta.js
// ==/UserScript==
 
(async function(axios, JSZip, saveAs, ImageDownloader) {
  'use strict';
 
  // reload page when enter or leave chapter
  const re = /https:\/\/ganma\.jp\/web\/reader\/(?<alias>.*)\/(?<episodeID>[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})\/\d+/;
  const oldHref = window.location.href;
  const timer = setInterval(() => {
    const newHref = window.location.href;
    if (re.exec(newHref) && re.exec(oldHref) && re.exec(newHref).groups.episodeID === re.exec(oldHref).groups.episodeID) return;
    if (re.test(newHref) || re.test(oldHref)) {
      clearInterval(timer);
      window.location.reload();
    }
  }, 200);
 
  // return if not reading chapter now
  if (!re.test(oldHref)) return;

  // init data receiver
  window._configData = [];

  // run scripts to get string of config
  const configString = await fetch(window.location.href)
    .then(res => res.text())
    .then(text => (new DOMParser()).parseFromString(text, 'text/html'))
    .then(dom => Array.from(dom.body.querySelectorAll('script')))
    .then(scriptElements => scriptElements.forEach(ele => eval(ele.textContent.replace('self.__next_f.push([', 'window._configData.push(['))))
    .then(_ => window._configData.toString());
 
  // get url of images
  let urls = JSON.parse(stringSlicer(configString, `"singleModeDisplayUnits":`, ']')).map(item => item.url);
  try {
    const { imageURL: afterwordImageURL } = JSON.parse(stringSlicer(configString, `"afterword":`, '}'));
    if (typeof afterwordImageURL === 'string' && afterwordImageURL.startsWith('https://')) urls = urls.concat(afterwordImageURL);
  } catch (error) {
    console.log(error);
    console.log('no afterword image');
  }
 
  // get title
  const title1 = document.querySelector('title').textContent.split('｜')[1].trim();
  const title2 = document.querySelector('h1.overflow-hidden').textContent.trim();
  const newtitle = `${title1} ${title2}`;
  let title = newtitle.replace(/(\?|\~|\/|\:|\<|\>)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            '<':'＜',
            '>':'＞',
            }[$1];
            });
 
 
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

  // slice string according to text content
  function stringSlicer(string, startText, endText) {
    const startIndex = string.indexOf(startText) + startText.length;
    const endIndex = string.indexOf(endText, startIndex);
    return string.slice(startIndex, endIndex + endText.length);
  }
 
})(axios, JSZip, saveAs, ImageDownloader);
