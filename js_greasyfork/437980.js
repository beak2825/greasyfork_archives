// ==UserScript==
// @name         FirecrossSpider
// @namespace    https://firecross.jp/
// @version      0.2
// @description  Image spider for firecross.jp | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://firecross.jp/reader/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437980/FirecrossSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/437980/FirecrossSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  const timer = setInterval(() => {
    if (document.getElementById('menu_nombre_total').innerText !== '') {
      start();
      clearInterval(timer);
    }
  }, 1000);

  async function start() {
    // get title
    const title = document.querySelector('head title').innerText;

    // get cgi
    const cgi = document.querySelector('#meta input[name=cgi]').value;

    // get param
    const param = encodeURIComponent(document.querySelector('#meta input[name=param]').value);

    // get page amount
    const pageAmount = parseInt(document.getElementById('menu_nombre_total').innerText);

    // get scramble image data
    const scrambleImageData = Array(pageAmount).fill('').map((item, index) => {
      return {
        imageURL: `https://firecross.jp${cgi}?mode=1&file=${String(index).padStart(4, '0')}_0000.bin&reqtype=0&param=${param}`,
        dictURL: `https://firecross.jp${cgi}?mode=8&file=${String(index).padStart(4, '0')}.xml&reqtype=0&param=${param}`
      }
    });

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 120px; left: 20px; z-index: 9999999; width: 120px; height: 36px; line-height: 36px; cursor: pointer; background-color: #eee; border: 1px solid #888; border-radius: 4px;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      download(scrambleImageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function getDecryptedImageBase64(data) {
    return new Promise(resolve => {
      const scrambleImage = document.createElement('img');
      scrambleImage.onload = async function () {
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

        // get scramble dict
        const dict = await axios.get(data.dictURL).then(res => res.data.match(/<Scramble>(.*)<\/Scramble>/)[1].split(',').map(digit => parseInt(digit)));
        const h = 8 * Math.floor(Math.floor(this.width / 4) / 8);
        const g = 8 * Math.floor(Math.floor(this.height / 4) / 8)

        for (let c, u, l, d, p, b = 0; b < dict.length; b++) {
          c = b % 4;
          u = Math.floor(b / 4);
          c *= h;
          u *= g;
          l = (p = dict[b]) % 4;
          d = Math.floor(p / 4);
          l *= h;
          d *= g;

          const piece = tempCtx.getImageData(l, d, h, g);
          destCtx.putImageData(piece, c, u);
        }

        resolve(destCanvas.toDataURL().replace('data:image/png;base64,', ''))
      }

      scrambleImage.src = data.imageURL;
    });
  }

  function download(scrambleImageData, title, dlBtn) {
    const promises = [];
    scrambleImageData.forEach(data => promises.push(getDecryptedImageBase64(data)));

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