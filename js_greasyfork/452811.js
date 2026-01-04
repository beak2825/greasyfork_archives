// ==UserScript==
// @name         LineMangaSpider
// @namespace    https://manga.line.me/
// @version      0.1
// @description  Image spider for manga.line.me
// @author       DD1969
// @match        https://manga.line.me/*/viewer*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://greasyfork.org/scripts/451810-imagedownloaderlib/code/ImageDownloaderLib.js?version=1096733
// @require      https://greasyfork.org/scripts/451812-publuscoordsgenerator/code/PublusCoordsGenerator.js?version=1096723
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/452811/LineMangaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/452811/LineMangaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator) {
  'use strict';

  // define types
  const typeDict = {
    NORMAL: 1,
    SCRAMBLE: 2,
    PUBLUS: 3
  }

  // get data of images and type
  const { imageData, type } = await new Promise(resolve => {
    const timer = setInterval(async () => {
      const option = unsafeWindow.OPTION;
      if (!option) return;

      // type 1, normal image
      const normalImages = option.imgs;
      const normalImageCount = Object.keys(normalImages).length;
      if (normalImageCount !== 0) {
        normalImages.length = normalImageCount;
        resolve({
          imageData: Array.from(normalImages),
          type: typeDict.NORMAL
        });
        clearInterval(timer);
        return;
      }

      // type 2, scramble image
      const pages = option.portalPages;
      const pageCount = Object.keys(pages).length;
      if (pageCount !== 0) {
        pages.length = pageCount;
        resolve({
          imageData: Array.from(pages),
          type: typeDict.SCRAMBLE
        });
        clearInterval(timer);
        return;
      }

      // type 3, using Publus reader
      const { mediado_contents_url, mediado_contents_file, mediado_token } = option;
      if (mediado_contents_url && mediado_contents_file && mediado_token) {
        const config = await new Promise(_resolve => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `${mediado_contents_url}${mediado_contents_file}?token=${mediado_token}`,
            responseType: 'json',
            onload: res => _resolve(res.response)
          });
        });

        resolve({
          imageData: config.configuration.contents.map(content => ({
            url: `${mediado_contents_url}${content.file}/0.jpeg?token=${mediado_token}`,
            pattern: Array.from(content.file + '/0').reduce((acc, cur) => acc + cur.charCodeAt(0), 0) % 4 + 1
          })),
          type: typeDict.PUBLUS
        });

        clearInterval(timer);
      }
    }, 500);
  });

  // setup ImageDownloader
  ImageDownloader({
    getImagePromises,
    title: unsafeWindow.OPTION.title,
    zipOptions: { base64: type !== typeDict.NORMAL }
  });

  // get promises of images
  function getImagePromises() {
    return imageData.map(data => {
      if (type === typeDict.NORMAL) return getNormalImage(data);
      else if (type === typeDict.SCRAMBLE) return getDecryptedImage(data);
      else return getPublusImage(data);
    });
  }

  // get normal image
  function getNormalImage(data) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: data.url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    });
  }

  // get decrypted image
  function getDecryptedImage(data) {
    return new Promise(async resolve => {
      const encryptedImageBuffer = await axios.get(data.url, { responseType: 'arraybuffer' }).then(res => res.data);
      const encryptedImageBase64 = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(encryptedImageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      const encryptedImage = document.createElement('img');
      encryptedImage.onload = function () {
        // extract data from metadata
        const columnCount = data.metadata.hc;
        const blockWidth = data.metadata.bwd;
        const imageWidth = data.metadata.iw;
        const imageHeight = data.metadata.ih;

        // create dest canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        context.imageSmoothingEnabled = false;
        context.drawImage(encryptedImage, 0, 0);

        // put pieces on their right place
        data.metadata.m.forEach((data, index) => {
          const parsed = parseInt(data, 35);
          const xPos = (parsed % columnCount) * blockWidth;
          const yPos = Math.floor(parsed / columnCount) * blockWidth;
          const pixelsLeft = (index % columnCount) * blockWidth;
          const pixelsTop = Math.floor(index / columnCount) * blockWidth;
          context.drawImage(
            encryptedImage,
            xPos,
            yPos,
            blockWidth,
            blockWidth,
            pixelsLeft,
            pixelsTop,
            blockWidth,
            blockWidth
          );
        });

        resolve(canvas.toDataURL().replace('data:image/png;base64,', ''));
      }

      encryptedImage.src = encryptedImageBase64;
    });
  }

  // get Publus image
  function getPublusImage(data) {
    return new Promise(async resolve => {
      const imageArraybuffer = await new Promise(resolve => {
        GM_xmlhttpRequest ( {
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const imageBase64 = 'data:image/jpg;base64,' + window.btoa(new Uint8Array(imageArraybuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const image = document.createElement('img');
      image.onload = function () {
        // 创建临时canvas画布
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;
        tempCtx.drawImage(this, 0, 0);

        // 创建目标canvas画布
        const destCanvas = document.createElement('canvas');
        const destCtx = destCanvas.getContext('2d');
        destCanvas.width = this.width;
        destCanvas.height = this.height;

        const coordConfigs = PublusCoordsGenerator(this.width, this.height, 64, 64, data.pattern);
        for (const coordConfig of coordConfigs) {
          const piece = tempCtx.getImageData(coordConfig.destX, coordConfig.destY, coordConfig.width, coordConfig.height);
          destCtx.putImageData(piece, coordConfig.srcX, coordConfig.srcY);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }

      image.src = imageBase64;
    });
  }

})(axios, JSZip, saveAs, ImageDownloader, PublusCoordsGenerator);