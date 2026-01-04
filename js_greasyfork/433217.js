// ==UserScript==
// @name         MangacrossSpider
// @namespace    https://mangacross.jp/
// @version      0.2
// @description  A manga spider for mangacross.jp | V0.2 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://mangacross.jp/comics/*/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433217/MangacrossSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/433217/MangacrossSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  const config = await axios.get(window.location.href + '/viewer.json').then(res => res.data);
  const episodeTitle = config.volume + ' ' + config.title;

  // setup download button
  const dlBtn = document.createElement('button');
  dlBtn.id = 'dl-btn';
  dlBtn.innerText = '下载';
  dlBtn.style = 'position: absolute; top: 20px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;';
  dlBtn.onclick = function () {
    dlBtn.disabled = true;
    dlBtn.innerText = "正在处理";
    download();
  }
  document.body.appendChild(dlBtn);

  // start download
  function download() {
    const promises = [];
    for (let i = 0; i < config.page_count; i++) {
      promises.push(new Promise(resolve => {
        axios.get(config.episode_pages[i].image.original_url, { responseType: 'blob' }).then(res => resolve(res.data));
      }))
    }

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(episodeTitle);
      for (let i = 0; i < images.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, images[i]);
      }
      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${episodeTitle}.zip`);
        dlBtn.disabled = false;
        dlBtn.innerText = "下载";
      });
    })
  }

})(axios, JSZip, saveAs);