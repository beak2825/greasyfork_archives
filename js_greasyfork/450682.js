// ==UserScript==
// @name         YawaspiSpider
// @namespace    https://yawaspi.com/
// @version      0.1
// @description  Image spider for yawaspi.com
// @author       DD1969
// @match        https://yawaspi.com/*/comic/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/450682/YawaspiSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/450682/YawaspiSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    const title = await new Promise(resolve => {
      const timer = setInterval(() => {
        const titleElement = document.querySelector('.page__header h3');

        if (titleElement) {
          clearInterval(timer);
          resolve(titleElement.textContent);
        }
      }, 200);
    });

    const imageURLs = await new Promise(resolve => {
      const timer = setInterval(() => {
        const imgElements = document.querySelectorAll('.vertical__inner ul li img');

        if (imgElements) {
          clearInterval(timer);
          resolve(Array.from(imgElements).map(element => element.src));
        }
      }, 200);
    });

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = `
      position: fixed;
      top: 80px;
      right: 5%;
      z-index: 9999999;

      width: 128px;
      height: 48px;

      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 14px;
      color: #fff;
      background-color: #0984e3;
      border-radius: 4px;
      cursor: pointer;
    `;
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
    const promises = [];
    imageURLs.forEach(url => {
      promises.push(new Promise(resolve => {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        })
      }));
    });

    const images = await Promise.all(promises);
    const zip = new JSZip();
    const folder = zip.folder(title);
    images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image));

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title}.zip`);
    dlBtn.innerText = "Completed";
  }

})(axios, JSZip, saveAs);