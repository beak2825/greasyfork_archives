// ==UserScript==
// @name         DMMDownloader
// @namespace    https://github.com/Timesient/manga-download-scripts
// @version      0.5
// @license      GPL-3.0
// @author       Timesient
// @description  Manga downloader for book.dmm.com
// @icon         https://p.dmm.com/p/common/pinned/general/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/451867-dmmdownloader
// @supportURL   https://github.com/Timesient/manga-download-scripts/issues
// @match        https://book.dmm.com/*
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @require      https://unpkg.com/jszip@3.7.1/dist/jszip.min.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://update.greasyfork.org/scripts/451810/1398192/ImageDownloaderLib.js
// @require      https://update.greasyfork.org/scripts/451812/1096723/PublusCoordsGenerator.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/451867/DMMDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451867/DMMDownloader.meta.js
// ==/UserScript==

/* 
  由于下载下来的图片普遍在最右侧有一条黑边，且各个作品的黑边宽度均不一致，暂无有效的解决方法，
  因此需要您每次下载前手动修改下一行中的数字（默认为0），例如将 0 修改为 5，它代表着将在每张
  下载下来的图片最右侧移除宽度为5个像素，高度为整张图片高度的区域，以此方式来准确去除黑边。

  Since some downloaded image will show a black stripe on the right and there is no solution
  by now, you will need to change the number(0 by default) in the following line, for example,
  change it to 5, so that every image will remove a 5 pixels width, full image height area.
*/
const widthToRemove = 0;

(async function (axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator) {
  'use strict';

  // get essential parameters
  const cid = new URLSearchParams(window.location.search).get('cid');
  const lin = new URLSearchParams(window.location.search).get('lin');
  if (!cid || !lin) return;

  // get auth data
  const authData = await new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://book.dmm.com/viewerapi/auth/?cid=${cid}&lin=${lin}`,
      responseType: 'json',
      onload: res => resolve(res.response)
    });
  });

  // get config data
  const { configData, isNeedNormalDefault } = await Promise.any([getConfigData(''), getConfigData('normal_default/')]);
  
  // get data of images
  const imageData = configData.configuration.contents.map(content => {
    const filename = content.file;
    const isShareFile = filename.includes('../');
    return Array(configData[filename].FileLinkInfo.PageCount).fill().map((_, index) => ({
      url: isNeedNormalDefault
        ? `${authData.url}${isShareFile ? '' : 'normal_default/'}${isShareFile ? filename.replace('../', '') : filename}/${index}.jpeg?${new URLSearchParams(authData.auth_info)}`
        : `${authData.url}${filename}/${index}.jpeg?${new URLSearchParams(authData.auth_info)}`,
      pattern: Array.from(filename + `/${index}`).reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % 4 + 1
    }));
  }).flat();

  // setup ImageDownloader
  ImageDownloader.init({
    maxImageAmount: imageData.length,
    getImagePromises,
    title: authData.cti.replaceAll('〜', ''),
    imageSuffix: 'jpeg'
  });

  // collect promises of image
  function getImagePromises(startNum, endNum) {
    return imageData
      .slice(startNum - 1, endNum)
      .map(data => getDecryptedImage(data)
        .then(ImageDownloader.fulfillHandler)
        .catch(ImageDownloader.rejectHandler)
      );
  }

  // get promise of decrypted image
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const imageArrayBuffer = await new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const image = document.createElement('img');
      image.src = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      image.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.width - widthToRemove;
        canvas.height = this.height;

        // draw pieces on correct position
        const coords = PublusCoordsGenerator(this.width, this.height, 64, 64, data.pattern);
        for (const { srcX, srcY, destX, destY, width, height } of coords) {
          ctx.drawImage(this, destX, destY, width, height, srcX, srcY, width, height);
        }

        canvas.toBlob(resolve);
      }
    });
  }

  // get config data
  function getConfigData(addon) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${authData.url}${addon}configuration_pack.json?${new URLSearchParams(authData.auth_info)}`,
        responseType: 'json',
        onload: res => resolve({
          configData: res.response,
          isNeedNormalDefault: addon === 'normal_default/'
        })
      });
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator);