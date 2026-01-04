// ==UserScript==
// @name         Wandoujia-IconDownloader
// @namespace    https://github.com/FotixChiang
// @version      0.0.1
// @description  用来在 豌豆荚 下载应用图标的脚本
// @author       Money
// @match        https://www.wandoujia.com/apps/*
// @contents     *://*.25pp.com
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422622/Wandoujia-IconDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/422622/Wandoujia-IconDownloader.meta.js
// ==/UserScript==

(function() {
  // Your code here...
  var a = document.createElement('a');
  a.innerHTML = '下载图标';
  // 增加内容
  // 增加样式
  a.className = 'download install-btn'
  a.href = 'javascript:;';
  a.download = document.getElementsByClassName("title")[0].innerText;
  a.click();
   var doDownload = function(blob, filename) {
     var a = document.createElement('a');
     a.download = filename;
     a.href = blob;
     a.click();
}
  var container = document.getElementsByClassName("download-wp")[0];
  container.appendChild(a,container.childNodes[0]);

  a.addEventListener('click', function (ev) {
  var blob = document.getElementsByClassName("app-icon")[0].childNodes[1].getAttribute('src');
  var filename = document.getElementsByClassName("title")[0].innerText;
  download(blob,filename);
});

   var download = function (url, filename) {
   if (!filename) filename = url.split('\\').pop().split('/').pop();
   fetch(url, {
      headers: new Headers({
        'Origin': location.origin
    }),
     mode: 'cors'
   })
  .then(response => response.blob())
  .then(blob => {
    let blobUrl = window.URL.createObjectURL(blob);
    doDownload(blobUrl, filename);
  })
  .catch(e => {console.error(e); return false;});

  return true;
}
   
})();