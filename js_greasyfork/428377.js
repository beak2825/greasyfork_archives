// ==UserScript==
// @name         ComicWalkerSpider
// @namespace    https://comic-walker.com/
// @version      0.4
// @description  Image spider for comic-walker.com | V0.4 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://comic-walker.com/viewer/*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428377/ComicWalkerSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/428377/ComicWalkerSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  // collect basic data
  const episodeID = dataLayer[0].episode_id;
  const episodeTitle = dataLayer[0].episode_title;
  const dataURL = `https://ssl.seiga.nicovideo.jp/api/v1/comicwalker/episodes/${episodeID}/frames`;

  // setup download button
  const dlBtn = document.createElement('button');
  dlBtn.innerText = "全篇下载";
  dlBtn.style = "position: absolute; top: 60px; left: 16px; z-index: 999999999; width: 100px; height: 40px; cursor: pointer;";
  dlBtn.addEventListener('click', function(e) {
    dlBtn.innerText = "正在处理";
    dlBtn.disabled = true;
    startDownload();
  })
  document.body.appendChild(dlBtn);

  // decrypt images and download
  async function startDownload() {
    const pages = await axios.get(dataURL).then(res => res.data.data.result);

    const promises = [];
    for (let i = 0; i < pages.length; i++) {
      promises.push(new Promise(resolve => {
        resolve(decryptPage(pages[i]));
      }))
    }

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(episodeTitle);

      for (let i = 0; i < images.length; i++) {
        folder.file(`${i < 9 ? '0' : ''}${i + 1}.jpg`, images[i].replace('data:image/jpg;base64,', ''), { base64: true });
      }

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${episodeTitle}.zip`);
        dlBtn.innerText = "下载完毕";
        dlBtn.disabled = false;
      });
    })
  }

  // get encrypted image and then decrypt
  async function decryptPage(page) {
    const pageURL = page.meta.source_url;
    const key = page.meta.drm_hash ? generateKey(page.meta.drm_hash.slice(0, 16)) : null;
    const imgBuffer = await axios.get(pageURL, { responseType: 'arraybuffer' }).then(res => res.data);

    let binary = '';
    let bytes = new Uint8Array(imgBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(key ? bytes[i] ^ key[i % 8] : bytes[i]);
    }

    return 'data:image/jpg;base64,' + window.btoa(binary);
  }

  // generate key map
  function generateKey(key) {
    const result = [];
    const keyArray = Array.from(key);
    for (let i = 0; i < keyArray.length; i++) {
      let keyCode = keyArray[i].charCodeAt(0);
      keyCode -= keyCode >= 97 ? 87 : 48;

      if (i % 2 === 0) result.push(keyCode * 16);
      else result[(i - 1) / 2] += keyCode;
    }

    return result;
  }

})(axios, JSZip, saveAs);