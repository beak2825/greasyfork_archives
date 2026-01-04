// ==UserScript==
// @name         YoungaceupSpider
// @namespace    https://web-ace.jp/youngaceup/
// @version      0.3
// @description  A manga spider for web-ace.jp/youngaceup | V0.3 调整下载按钮的位置
// @author       DD1969
// @match        https://web-ace.jp/youngaceup/contents/*/episode/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433648/YoungaceupSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/433648/YoungaceupSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  const urls = await axios.get(window.location.href + 'json').then(res => res.data.map(url => 'https://web-ace.jp' + url));
  const title = document.querySelector('head > title').innerText.split('｜')[0];

  // setup download button
  const dlBtn = document.createElement('button');
  dlBtn.id = 'dl-btn';
  dlBtn.innerText = '下载';
  dlBtn.style = 'position: fixed; top: 240px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;';
  dlBtn.onclick = function () {
    dlBtn.disabled = true;
    dlBtn.innerText = "正在处理";
    download(urls, title, dlBtn);
  }
  document.body.appendChild(dlBtn);

  // start download
  function download(urls, title, dlBtn) {
    const promises = [];
    for (let i = 0; i < urls.length; i++) {
      promises.push(new Promise(resolve => {
        axios.get(urls[i], { responseType: 'blob' }).then(res => resolve(res.data));
      }))
    }

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      for (let i = 0; i < images.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, images[i]);
      }
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    })
  }

})(axios, JSZip, saveAs);