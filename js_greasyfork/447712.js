// ==UserScript==
// @name         YomongaSpider
// @namespace    https://www.yomonga.com/
// @version      0.1
// @description  Image spider for www.yomonga.com
// @author       DD1969
// @match        https://www.yomonga.com/*
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jszip/3.7.1/jszip.min.js
// @require      https://lib.baomitu.com/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447712/YomongaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/447712/YomongaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {
  'use strict';

  // add info
  const info = document.createElement('span');
  info.innerText = "注意：点击打开某一章节后，请至少刷新一次页面";
  info.style = 'position: fixed; top: 40px; left: 40px; z-index: 999999; height: 20px; padding: 4px; border-radius: 4px; background-color: royalblue; color: white; font-size: 13px;';
  document.body.appendChild(info);

  const timer = setInterval(() => {
    const isChapterPage = window.location.href.includes('chapter');
    const downloadButton = document.getElementById('dl-btn');

    // if is chapter page & not setup download button yet
    if (isChapterPage && !downloadButton) {
      setupDownloadButton();
    }

    // if not chapter page & there is download button, remove it
    if (!isChapterPage && downloadButton) {
      downloadButton.remove();
    }
  }, 500);

  // clear timer before page unload
  window.addEventListener('beforeunload', (event) => {
    clearInterval(timer);
  });

  async function setupDownloadButton() {
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = 'Download';
    dlBtn.style = 'position: fixed; top: 72px; left: 40px; z-index: 999999; width: 128px; height: 48px; border-radius: 4px; background-color: royalblue; color: white; cursor: pointer;';
    dlBtn.onclick = async function () {
      dlBtn.disabled = true;
      dlBtn.style.backgroundColor = 'gray';
      dlBtn.innerText = "Processing";

      // get chapter id
      const chapterId = window.location.href.split('chapter/')[1];

      // get title
      const title = `yomonga-chapter-${chapterId}`;

      // get encrypted image data
      const url = `https://www.yomonga.com/api/chapter?id=${chapterId}`;
      const content = await axios.get(url).then(res => res.data);
      const regexp = /(https:\/\/www\.yomonga.*manga_page.*duration=\d+).*([0-9a-z]{128})/gm;
      const encryptedImageData = Array.from(content.matchAll(regexp)).map(item => ({ url: item[1], key: item[2] }));

      download(encryptedImageData, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  async function getDecryptedImageData(encryptedImageData) {
    const decryptedImageData = [];
    for (let i = 0; i < encryptedImageData.length; i++) {
      const encryptedImage = await axios.get(encryptedImageData[i].url, { responseType: 'arraybuffer' }).then(res => res.data);
      const parsedKey = new Uint8Array(encryptedImageData[i].key.match(/.{1,2}/g).map(e => parseInt(e, 16)));
      const decoder = createMinobiDecoder(parsedKey);
      decryptedImageData.push(decoder(encryptedImage));
    }

    return decryptedImageData;
  }

  function createMinobiDecoder(e) {
    return function(t) {
      var n = new Uint8Array(t).map(function(t, n) {
        return t ^ e[n % e.length]
      });
      return new Blob([n], {
        type: "image/png"
      })
    }
  }

  async function download(encryptedImageData, title, dlBtn) {
    const decryptedImageData = await getDecryptedImageData(encryptedImageData);

    const zip = new JSZip();
    const folder = zip.folder(title);
    decryptedImageData.forEach((image, index) => folder.file(`${String(index + 1).padStart(2, '0')}.png`, image));

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title}.zip`);
    dlBtn.innerText = "Completed";
  }

})(axios, JSZip, saveAs);