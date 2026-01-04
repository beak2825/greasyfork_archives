// ==UserScript==
// @name         WelomaSpider
// @namespace    https://weloma.net/
// @version      0.6
// @description  Image spider for weloma.art | V0.6 修改图片链接收集方式，修复重复下载的bug
// @author       DD1969
// @match        https://weloma.art/*/*/
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/438282/WelomaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/438282/WelomaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // delete report button
    const reportBtn = document.getElementById('report_error');
    if (reportBtn) reportBtn.remove();

    // get title
    const title = document.querySelector('.select-chapter select option:nth-child(1)').innerText.trim();

    // get image urls
    const imageURLs = await new Promise(resolve => {
      const timer = setInterval(() => {
        const urls = [];
        document.querySelectorAll('.chapter-img').forEach(img => urls.push(img.src));
        if(urls.every(url => !url.includes('loading'))) {
          resolve(urls);
          clearInterval(timer);
        }
      }, 1000);
    })

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 100px; left: 40px; z-index: 9999999; width: 120px; height: 36px; line-height: 36px; cursor: pointer; background-color: #eee; border: 1px solid #888; border-radius: 4px;';
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "Processing";
      download(imageURLs, title, dlBtn);
    }
    document.body.appendChild(dlBtn);

    // setup info
    const info = document.createElement('span');
    info.style = 'position: fixed; top: 64px; left: 40px; z-index: 9999999; width: 498px; height: 24px; line-height: 24px; background-color: #eee; border: 1px solid #888; border-radius: 4px; padding-left: 10px;';
    info.innerText = '※请在按下下载按钮前，至少F5刷新页面一次，以保证脚本在该网站正常运行';
    document.body.appendChild(info);
  }

  async function download(imageURLs, title, dlBtn) {
    const promises = [];
    for(let i = 0; i < imageURLs.length; i++) {
      promises.push(new Promise(resolve => {
        GM_xmlhttpRequest ( {
          method: 'GET',
          url: imageURLs[i],
          responseType: 'arraybuffer',
          onload: res => resolve(res.response)
        });
      }));
    }

    const images = await Promise.all(promises);
    const zip = new JSZip();
    const folder = zip.folder(title);
    images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.jpg`, image));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${title}.zip`);
      dlBtn.innerText = "Completed";
    });
  }

})(axios, JSZip, saveAs);