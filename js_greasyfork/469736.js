// ==UserScript==
// @name         SpeedbinbDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for specific for Speedbinb reader
// @icon         https://gammaplus.takeshobo.co.jp/img/common/favicon.ico
// @homepageURL  https://greasyfork.org/zh-CN/scripts/451879-speedbinbdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://gammaplus.takeshobo.co.jp/_files/*
// @match        https://storia.takeshobo.co.jp/_files/*
// @match        https://webcomicgamma.takeshobo.co.jp/_files/*
// @match        https://kirapo.jp/pt/*
// @match        https://www.123hon.com/vw/*
// @match        https://www.comic-valkyrie.com/samplebook/*
// @match        https://manga.zerosumonline.com/online/*
// @match        https://manga-mee.jp/trial_reading/*
// @match        https://www.comicride.jp/viewer/*
// @match        https://www.comic-brise.com/comic_ep/*
// @match        https://7irocomics.jp/webcomic/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1129512
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/469736/SpeedbinbDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469736/SpeedbinbDownloader.meta.js
// ==/UserScript==

(async function (axios, JSZip, saveAs, ImageDownloader) {
  'use strict';
  
  // get base URL
  const href = window.location.href;
  function normalizeURL(href) {
    if (/123hon\.com|manga-mee\.jp/.test(href)) {
      return href.replace('index.html', '');
    }
    if (/kirapo\.jp/.test(href)) {
      return href.replace('viewer', '');
    }
    return href;
  }
  const baseURL = normalizeURL(href);

  // get url of json files
  const html = await axios.get(window.location.href).then(res => res.data);
  const urls = html.match(/data\/\d+\.ptimg\.json/gm).map(json => baseURL + json);

  // get title
  const title0 = document.querySelector('title').textContent;
  let title = title0.replace(/(\?|\~|\/|\:|【単話版】|【期間限定無料】)/gi,  function ($0, $1) {
        return {
            '?':'？',
            '~':'～',
            '/':'／',
            ':':'：',
            '【単話版】':'',
            '【期間限定無料】':'',
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
      .map(url => getDecryptedImage(url)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  function getDecryptedImage(url) {
    return new Promise(async resolve => {
      // get config of image
      const config = await axios.get(url).then(res => res.data);

      const image = document.createElement('img');
      image.src = `${baseURL}data/${config.resources.i.src}`;
      image.onload = function () {
        // create destination canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = config.views[0].width;
        canvas.height = config.views[0].height;

        // get coordinates, width, height of pieces
        const coords = config.views[0].coords.map(coord => {
          const items = coord.match(/^([^:]+):(\d+),(\d+)\+(\d+),(\d+)>(\d+),(\d+)$/);
          if (!items) throw new Error("Invalid format for Image Transfer : " + coord);

          return {
            srcX: parseInt(items[2], 10),
            srcY: parseInt(items[3], 10),
            width: parseInt(items[4], 10),
            height: parseInt(items[5], 10),
            destX: parseInt(items[6], 10),
            destY: parseInt(items[7], 10)
          }
        });

        // draw pieces on correct position
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, srcX, srcY, width, height, destX, destY, width, height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

})(axios, JSZip, saveAs, ImageDownloader);
