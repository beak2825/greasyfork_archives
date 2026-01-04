// ==UserScript==
// @name         PiccomaSpider
// @namespace    https://piccoma.com/
// @version      0.2
// @description  Image spider for piccoma.com
// @author       DD1969
// @match        https://piccoma.com/web/viewer/*/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/445479/PiccomaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/445479/PiccomaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {

    const [pdata, get_seed] = await new Promise(resolve => {
      const timer = setInterval(() => {
        if (unsafeWindow._pdata_ && unsafeWindow.get_seed && unsafeWindow.unscrambleImg) {
          clearInterval(timer);
          resolve([unsafeWindow._pdata_, unsafeWindow.get_seed]);
        }
      }, 500);
    });

    const title = pdata.title;
    const imageData = pdata.img.filter(img => img.path !== '').map(config => {
      const url = new URL('https:' + config.path);
      const sum = url.pathname.split('/')[4];
      const expire = url.search.match(/\d{10}/)[0];
      config.url = 'https:' + config.path;
      config.seed = get_seed(sum, expire);
      delete config.path;

      return config;
    });

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 60px; left: 40px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      download(imageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getDecodedImageBase64Promise(data) {
    return new Promise(async resolve => {
      const imageArraybuffer = await new Promise(resolve => {
        GM_xmlhttpRequest ( {
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      });

      const imageBase64 = 'data:image/jpg;base64,' + btoa(new Uint8Array(imageArraybuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const image = document.createElement('img');
      image.onload = function () {
        const result = unsafeWindow.unscrambleImg(image, 50, data.seed);
        resolve(result[0].toDataURL().replace('data:image/png;base64,', ''));
      }

      image.src = imageBase64;
    });
  }

  function download(imageData, title, dlBtn) {
    const promises = [];
    imageData.forEach(data => promises.push(getDecodedImageBase64Promise(data)));

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpeg`, image, { base64: true }));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "Completed";
      });
    });
  }

})(axios, JSZip, saveAs);