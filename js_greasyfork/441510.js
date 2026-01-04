// ==UserScript==
// @name         WebnewtypeSpider
// @namespace    https://comic.webnewtype.com
// @version      0.2
// @description  Image spider for comic.webnewtype.com | V0.2 修复无法获取标题的bug
// @author       DD1969
// @match        https://comic.webnewtype.com/contents/*/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441510/WebnewtypeSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/441510/WebnewtypeSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // get title
    const title = document.querySelector('.contents__ttl--comic')?.textContent.trim();

    if (!title) return;

    // get image urls
    const imageURLs = await axios.get(window.location.href + 'json').then(res => {
      return res.data.map(url => {
        const parts = url.split('/').filter(part => part !== '');
        parts.pop();
        return '/' + parts.join('/');
      });
    });

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = `
      position: fixed;
      top: 180px;
      left: 40px;
      z-index: 9999;
      width: 120px;
      height: 36px;
      cursor: pointer;
      background-color: lightseagreen;
      color: white;
      border: 1px solid lightseagreen;
      border-radius: 4px;
    `;
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      dlBtn.style.backgroundColor = '#bbb';
      dlBtn.style.borderColor = '#bbb';
      dlBtn.style.cursor = 'not-allowed';
      download(imageURLs, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  async function download(imageURLs, title, dlBtn) {
    const images = [];
    for(let i = 0; i < imageURLs.length; i++) {
      await axios.get(window.location.origin + imageURLs[i], { responseType: 'arraybuffer' }).then(res => images.push(res.data));
    }

    const zip = new JSZip();
    const folder = zip.folder(title);
    images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);
      dlBtn.innerText = "Completed";
    });
  }

})(axios, JSZip, saveAs);