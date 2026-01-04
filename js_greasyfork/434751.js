// ==UserScript==
// @name         NicoMangaSpider
// @namespace    https://seiga.nicovideo.jp/
// @version      0.4
// @description  A manga spider for seiga.nicovideo.jp | V0.4 在序号1-9的图片文件名前加上前缀'0'
// @author       DD1969
// @match        https://seiga.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seiga.nicovideo.jp
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434751/NicoMangaSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/434751/NicoMangaSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs) {

  start();

  // start prossessing data
  function start() {
    const imageUrls = args.pages.map(page => page.url);
    const title = document.querySelector('.episode_title').innerText;

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 60px; left: 20px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(imageUrls, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  // get image in base64 format
  function getImageBase64Promise(imageUrl) {
    return new Promise(async resolve => {
      let imageSrc;
      if (imageUrl.startsWith('https://drm.cdn')) {
        const imageKey = imageUrl.match(/image\/([a-z0-9_]+)/)[1].split('_')[0];
        const encryptedImageData = await axios({ url: imageUrl, responseType: 'arraybuffer' }).then(res => new Uint8Array(res.data));
        const decryptedImageData = decrypt(encryptedImageData, imageKey);
        imageSrc = "data:image/png;base64," + btoa(decryptedImageData.reduce((acc, cur) => acc + String.fromCharCode(cur), ""));
      } else {
        const imagePromise = new Promise(resolve => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            onload: res => resolve(res.response)
          });
        });
        imageSrc = "data:image/webp;base64," + btoa(new Uint8Array(await imagePromise).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      }

      const img = document.createElement('img');
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL().split('base64,')[1]);
      }
      img.src = imageSrc;

      function decrypt(e, t) {
        const r = [];
        for (let n = 0; n < 8; n++) { r.push(parseInt(t.substr(2 * n, 2), 16)); }
        for (let n = 0; n < e.length; n++) { e[n] = e[n] ^ r[n % 8]; }

        return e;
      }
    });
  }

  // download images
  function download(urls, title, dlBtn) {
    const promises = [];
    urls.forEach(url => promises.push(getImageBase64Promise(url)));

    Promise.all(promises).then(images => {
      const zip = new JSZip();
      const folder = zip.folder(title);
      images.forEach((image, index) => folder.file(`${index < 9 ? '0' : ''}${index + 1}.png`, image, { base64: true }));

      zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, `${title}.zip`);
        dlBtn.innerText = "下载完毕";
      });
    })
  }

})(axios, JSZip, saveAs);