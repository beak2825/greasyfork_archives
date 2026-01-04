// ==UserScript==
// @name         PixivComicSpider
// @namespace    https://comic.pixiv.net/
// @version      0.2
// @description  Image spider for comic.pixiv.net | V0.2 修改获取图片时的request的header参数
// @author       DD1969
// @match        https://comic.pixiv.net/viewer/stories/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/438996/PixivComicSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/438996/PixivComicSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, CryptoJS) {
  'use strict';

  start();

  async function start() {
    // generate time string and hash
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const time = `${year}-${month}-${date}T${hour}:${minute}:${second}+08:00`;
    const hash = CryptoJS.MD5(`${time}mAtW1X8SzGS880fsjEXlM73QpS1i4kUMBhyhdaYySk8nWz533nrEunaSplg63fzT`).toString();

    // generate api url
    const apiURL = `https://comic.pixiv.net/api/app/episodes/${window.location.href.split('/').slice(-1)}/read`;

    // get chapter data
    const data = await axios.get(apiURL, {
      headers: {
        'x-client-time': time,
        'x-client-hash': hash,
        'x-requested-with': 'pixivcomic'
      }
    }).then(res => res.data.data.reading_episode);

    // get title
    const title = data.title;

    // get image urls
    const urls = data.pages.map(page => page.url);

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 60px; left: 40px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
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
      await axios.get(url, {
        responseType: 'arraybuffer'
      }).then(res => resolve(res.data));
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

})(axios, JSZip, saveAs, CryptoJS);