// ==UserScript==
// @name              lurldownloader
// @version           0.0.1
// @author            Zoosewu
// @description       download file in lurl
// @match             https://lurl.cc/*
// @license           MIT
// @name:zh-TW        lurl下載器
// @namespace         https://github.com/zoosewu/
// @description:zh-tw 下載lurl的檔案
// @run-at            document-idle
// @homepageURL       https://github.com/zoosewu/
// @downloadURL https://update.greasyfork.org/scripts/476327/lurldownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/476327/lurldownloader.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
  const body = $('body')
  body.append($("<button id='z-download-button' type='button'>download</button>"))
  body.append($("<label id='z-download-label' for='url'>url: </label>"))
  body.append($("<input id='z-download-input' type='text' id='url' name='url' required size='140'>"))
  const button = $("#z-download-button")
  const input = $("#z-download-input")
  button.on("click", function () {
    download(input[0].value)
  });
})();
const download = (link) => {
  console.log('link: ', link);
  console.log('start downloading file,please wait a minute...');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', link, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    console.log('file downloaded.');
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.target = '_blank';
    const regex = /[^\/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/;
    const result = regex.exec(link);
    let name = 'download.mp4';
    if (result && result.length > 0) name = result[0]
    tag.download = name;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.onerror = err => { console.log('failed to download file'); };
  xhr.send();
}