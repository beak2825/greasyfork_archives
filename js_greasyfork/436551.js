// ==UserScript==
// @name         YanmagaSpider
// @namespace    https://yanmaga.jp/
// @version      0.2
// @description  Image spider for yanmaga.jp | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://yanmaga.jp/comics/*/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436551/YanmagaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/436551/YanmagaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // get title
    const title = document.querySelector('.episode-header-title').innerText;

    // get images data
    const info = document.getElementById('comici-viewer');
    const baseUrl = `https://api2-yanmaga.comici.jp/book/contentsInfo?user-id=${info.dataset.memberJwt}&comici-viewer-id=${info.attributes['comici-viewer-id'].value}&page-from=0&page-to=`;
    const pageCount = await axios.get(baseUrl + '1').then(res => res.data.totalPages);
    const imageData = await axios.get(baseUrl + pageCount).then(res => res.data.result);

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 120px; left: 20px; z-index: 9999999; width: 120px; height: 36px; line-height: 36px; cursor: pointer; background-color: #eee; border: 1px solid #888; border-radius: 4px;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      download(imageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getDecryptedImageBase64(data) {
    return new Promise(async resolve => {
      const shuffleImg = document.createElement('img');
      shuffleImg.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx.drawImage(this, 0, 0);

        const l = Math.floor(data.width / 4);
        const d = Math.floor(data.height / 4);

        const In = [];
        for (let kn = 0, Sn = 0; Sn < 4; Sn++) {
          for (let On = 0; On < 4; On++) {
            In[kn++] = [Sn, On];
          }
        }

        const p = function(e, t) {
          for (var n = e.length, r = [], i = t.replace(/\s+/g, "").slice(1).slice(0, -1).split(","), a = 0; a < n; a++) {
            r.push(e[i[a]]);
          }

          return r;
        }(In, data.scramble);

        for(let f = 0, v = 0; v < 4; v++) {
          for (let h = 0; h < 4; h++) {
            const g = p[f][0];
            const m = p[f][1];
            f++;

            ctx.drawImage(this, l * g, d * m, l, d, l * v, d * h, l, d);
          }
        }

        resolve(canvas.toDataURL().replace('data:image/png;base64,', ''))
      }

      shuffleImg.src = await axios.get(data.imageUrl, { responseType: 'arraybuffer' }).then(res => 'data:image/jpg;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')));
    });
  }

  function download(imageData, title, dlBtn) {
    const promises = [];
    imageData.forEach(data => promises.push(getDecryptedImageBase64(data)));

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image, { base64: true }));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "Completed";
      });
    });
  }

})(axios, JSZip, saveAs);