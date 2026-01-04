// ==UserScript==
// @name         MagGardenSpider
// @namespace    https://kansai.mag-garden.co.jp/
// @version      0.1
// @description  Image spider for kansai.mag-garden.co.jp
// @author       DD1969
// @match        https://kansai.mag-garden.co.jp/assets/files/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/446075/MagGardenSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/446075/MagGardenSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {

    const titleElement = await new Promise(resolve => {
      const timer = setInterval(() => {
        const titleElement = document.querySelector('.acti-header-container .acti-title');

        if (titleElement) {
          clearInterval(timer);
          resolve(titleElement);
        }
      }, 500);
    });

    const id = titleElement.innerText.trim().split(' ')[0];
    const title = id;
    const pageAmount = parseInt(titleElement.innerText.trim().split('/')[1].replace(')', '').trim());
    const imageURLs = Array.from({ length: pageAmount }, (_, index) => `https://kansai.mag-garden.co.jp/assets/files/${id}/books/images/2/${index + 1}.jpg`);

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 60px; left: 60px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer; color: #fff; background-color: #0984e3; border-radius: 4px; font-size: 14px; display: flex; justify-content: center; align-items: center;';
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      dlBtn.style.backgroundColor = '#aaa';
      dlBtn.style.cursor = 'not-allowed';
      download(imageURLs, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }


  async function download(imageURLs, title, dlBtn) {
    const promises = imageURLs.map(url => axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data));

    const images = await Promise.all(promises);
    const zip = new JSZip();
    const folder = zip.folder(title);
    images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image));

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title}.zip`);
    dlBtn.innerText = "Completed";
  }

})(axios, JSZip, saveAs);