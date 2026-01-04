// ==UserScript==
// @name         UrasundaySpider
// @namespace    https://urasunday.com/
// @version      0.2
// @description  Image spider for urasunday.com | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://urasunday.com/title/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/436209/UrasundaySpider.user.js
// @updateURL https://update.greasyfork.org/scripts/436209/UrasundaySpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  start();

  async function start() {
    // get title
    const title = document.querySelector('.title').children[0].innerText.split('\n')[0];

    // get image urls from document
    const urls = await new Promise(resolve => {
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: window.location.href,
        headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' },
        onload: res => resolve(res.response.match(/src: '.*'/gm).map(url => url.split('\'')[1]))
      });
    })

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 120px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
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
      resolve(await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data))
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