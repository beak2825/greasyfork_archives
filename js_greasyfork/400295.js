// ==UserScript==
// @name        Nyaa.si - Load Thumbnail
// @name:ja     Nyaa.si - Load Thumbnail
// @name:zh-CN  Nyaa.si - 自动加载预览图
// @name:zh-TW  Nyaa.si - 自動載入預覽圖
// @description       Load image from hentai-covers links.
// @description:ja    hentai-coversのリンクから画像を読み込みます。
// @description:zh-CN 加载预览图从hentai-covers的链接。
// @description:zh-TW 加載預覽圖從hentai-covers的鏈接。
// @namespace   none
// @version     1.4
// @include     https://sukebei.nyaa.si/view/*
// @connect     hentai-covers.site
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/400295/Nyaasi%20-%20Load%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/400295/Nyaasi%20-%20Load%20Thumbnail.meta.js
// ==/UserScript==
(function () {
  let desc = document.querySelector('#torrent-description');
  if (desc) {
    let urls = desc.innerText.match(/https?:\/\/hentai-covers\.site\/image\/\w+/g);
    if (urls) {
      desc.parentNode.insertAdjacentHTML('afterend', '<div class="panel panel-default"><div class="panel-body" id="hentai-covers"></div></div>');
      let covers = document.querySelector('#hentai-covers');
      urls.forEach(url => {
        let loading = document.createElement('div');
        loading.innerHTML = 'Loading... ';
        covers.appendChild(loading);
        GM_GET(url, result => {
          if (result.status == 200) {
            let doc = new DOMParser().parseFromString(result.responseText, 'text/html');
            let img = doc.querySelector('#image-viewer-container > img');
            //if (img) loading.innerHTML = '<img src="' + img.src + '">';
            if (img) {
              GM_GET(img.src, result => {
                loading.innerHTML = '<img src="' + img.src + '">';
              });
            }
            else loading.innerHTML += 'Error: image not found.';
          } else loading.innerHTML += 'Error: ' + result.status;
        });
      });
    }
  }
})();

function GM_GET(url, callback) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    headers: {referer: "https://hentai-covers.site/"},
    onload: result => callback(result),
    onerror: result => callback(result),
    ontimeout: result => callback(result)
  });
}
