// ==UserScript==
// @name         ComicoSpider
// @namespace    https://www.comico.jp/
// @version      0.6
// @description  Image spider for www.comico.jp | V0.6 调整提示信息右间距
// @author       DD1969
// @match        https://www.comico.jp/comic/*
// @match        https://www.comico.jp/comic/*/chapter/*/product
// @icon         https://www.google.com/s2/favicons?sz=64&domain=comico.jp
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439359/ComicoSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/439359/ComicoSpider.meta.js
// ==/UserScript==

(async function(axios, JSZip, saveAs, CryptoJS) {
  'use strict';

  if (!window.location.href.includes('chapter')) {
    const info = document.createElement('span');
    info.innerText = '※点击打开某一章节后请刷新页面，这样脚本才能正常运作';
    info.style = 'position: fixed; bottom: 20px; right: 0; z-index: 9999999; width: 380px; padding: 4px; height: 24px; line-height: 24px; text-align: center; font-size: 14px; color: #f6e58d; background-color: #353b48; border-radius: 3px;';
    document.body.appendChild(info);
  } else {
    start();
  }

  async function start() {

    let title;
    let imageURLs;

    try {
      const jsFilename = await axios.get(window.location.href).then(res => (res.data).match(/<script src="\/js\/(app\.[0-9a-zA-Z]{8}\.js)"><\/script>/)[1]);
      const webKey = await axios.get(`https://www.comico.jp/js/${jsFilename}`).then(res => (res.data).match(/String\(t\),a="([0-9a-z]*)"/)[1]);
      const timestamp = Math.round(Date.now() / 1000);
      const checkSum = CryptoJS.SHA256(webKey + '0.0.0.0' + timestamp).toString(CryptoJS.enc.Hex);

      console.log(jsFilename);
      console.log(webKey);
      console.log(timestamp);
      console.log(checkSum);

      const response = await axios({
        url: 'https://api.comico.jp' + window.location.pathname,
        method: 'GET',
        withCredentials: true,
        headers: {
          'X-comico-check-sum': checkSum,
          'X-comico-client-accept-mature': 'Y',
          'X-comico-client-immutable-uid': '0.0.0.0',
          'X-comico-client-os': 'other',
          'X-comico-client-platform': 'web',
          'X-comico-client-store': 'other',
          'X-comico-request-time': timestamp,
          'X-comico-timezone-id': 'Asia/Hong_Kong'
        }
      })

      console.log(response);

      const data = response.data.data.chapter;

      console.log(data);

      // get title
      title = data.name;

      // get image urls
      imageURLs = data.images;

      console.log(title);
      console.log(imageURLs);

    } catch (err) {
      console.log(err);
    }

    // setup download button
    const dlBtn = document.createElement('button');
    dlBtn.id = 'dl-btn';
    dlBtn.innerText = '下载';
    dlBtn.style = 'position: fixed; top: 80px; left: 40px; z-index: 9999999; width: 100px; height: 32px; cursor: pointer; background-color: #eee; border: 1px solid #aaa; border-radius: 3px;'
    dlBtn.onclick = function () {
      dlBtn.disabled = true;
      dlBtn.innerText = "正在处理";
      download(imageURLs, title, dlBtn);
    }
    document.body.appendChild(dlBtn);
  }

  function AESDecoder(text) {
    const key = 'a7fc9dc89f2c873d79397f8a0028a4cd';
    const iv = CryptoJS.enc.Utf8.parse(CryptoJS.enc.Hex.parse(''));
    const passPhrase = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.AES.decrypt(text, passPhrase, {
      iv,
      mode: CryptoJS.mode.CBC
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  }

  function download(imageURLs, title, dlBtn) {
    const promises = [];
    imageURLs.forEach(imageURL => promises.push(new Promise(async resolve => {
      const url = `${AESDecoder(imageURL.url)}?${imageURL.parameter}`;
      GM_xmlhttpRequest ( {
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        onload: res => resolve(res.response)
      });
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