// ==UserScript==
// @name         AlphapolisSpider
// @namespace    https://www.alphapolis.co.jp/
// @version      0.2
// @description  Image spider for www.alphapolis.co.jp | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://www.alphapolis.co.jp/manga/official/*/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436298/AlphapolisSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/436298/AlphapolisSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // get title
    const title = document.querySelector('.toc-button h1').innerText;

    // get image urls from document
    const urls = await axios.get(window.location.href).then(res => res.data.match(/https:\/\/cdn-image\.alphapolis\.co\.jp\/official_manga\/page\/\d*\/\d*\/.*.jpg/g).slice(1));

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 76px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(urls, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function download(urls, title, dlBtn) {
    const promises = [];
    urls.forEach(url => promises.push(new Promise(async resolve => {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
    })));

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image, { binary: true }));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    });
  }

})(axios, JSZip, saveAs);