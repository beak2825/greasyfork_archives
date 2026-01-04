// ==UserScript==
// @name         TocoronaexSpider
// @namespace    https://to-corona-ex.com/
// @version      0.1
// @description  Image spider for to-corona-ex.com
// @author       DD1969
// @match        https://to-corona-ex.com/episodes/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/444814/TocoronaexSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/444814/TocoronaexSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    const apiURL = `https://api.to-corona-ex.com${window.location.pathname}/begin_reading`;
    const episodeData = await axios.get(apiURL).then(res => res.data);
    const title = episodeData.episode_title;
    const encryptedImageData = episodeData.pages.map(page => ({ url: page.page_image_url, hash: page.drm_hash }));

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 40px; left: 40px; z-index: 9999999; width: 100px; height: 32px; padding: 4px; cursor: pointer; background-color: #1990FF;font-size:14px; color: #ffffff; border-radius: 4px;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      dlBtn.style.cursor = 'not-allowed';
      dlBtn.style.backgroundColor = '#aaaaaa';
      download(encryptedImageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getDecryptedImageBase64(data) {
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

      image.onload = function() {
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

        const dict = (function(hash) {
          const origin = atob(hash);
          const result = [];

          for (let i = 0; i < origin.length; i++) {
            result[i] = origin.charCodeAt(i);
          }

          return result;
        })(data.hash);

        let i = dict[0],
            o = dict[1],
            a = dict.slice(2),
            s = this.width,
            u = this.height,
            l = Math.floor((s - s % 8) / i),
            f = Math.floor((u - u % 8) / o);

        for (let j = 0; j < i * o; j += 1) {
          let h = a[j],
              p = h % i,
              m = Math.floor(h / i),
              g = j % i,
              v = Math.floor(j / i);

          const piece = tempCtx.getImageData(p * l, m * f, l, f);
          destCtx.putImageData(piece, g * l, v * f);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''));
      }

      image.src = imageBase64;
    });
  }

  async function download(encryptedImageData, title, dlBtn) {
    const decryptedImages = await Promise.all(encryptedImageData.map(data => getDecryptedImageBase64(data)));

    const zip = new JSZip();
    const folder = zip.folder(title);
    decryptedImages.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpeg`, image, { base64: true }));

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${title}.zip`);
    dlBtn.innerText = "Completed";
  }

})(axios, JSZip, saveAs);