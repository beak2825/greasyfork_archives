// ==UserScript==
// @name         文本转语音下载(火山翻译)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  火山翻译文本转语音mp3音频下载
// @author       Kevin2li
// @match        https://translate.volcengine.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456887/%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3%E4%B8%8B%E8%BD%BD%28%E7%81%AB%E5%B1%B1%E7%BF%BB%E8%AF%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456887/%E6%96%87%E6%9C%AC%E8%BD%AC%E8%AF%AD%E9%9F%B3%E4%B8%8B%E8%BD%BD%28%E7%81%AB%E5%B1%B1%E7%BF%BB%E8%AF%91%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Your code here...
// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

const originOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (_, url) {
  if (url.startsWith("/web/tts/v1/?msToken=")) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText);
        const data = res.audio.data;
        var downloadFileName = "火山翻译-";
        var timeStamp = new Date().getTime().toString();
        downloadFileName = downloadFileName + timeStamp.substring(0, timeStamp.length) + ".mp3";

        const blob = b64toBlob(data, "audio/mp3");
        const blobUrl = URL.createObjectURL(blob);

        let downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = downloadFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        this.responseText = JSON.stringify(res);
      }
    });
  }
  originOpen.apply(this, arguments);
};
})();