// ==UserScript==
// @name         IconDownloader
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  用来在 Google Play 下载应用图标的脚本
// @author       Money
// @match        *://play.google.com/store/apps/details?id=*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422535/IconDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/422535/IconDownloader.meta.js
// ==/UserScript==

(function() {
  // Your code here...
   var a = document.createElement('a');
  a.innerHTML = 'Download Icon';
  a.className = 'icon-download LkLjZd ScJHi  nMZKrb  g3P27d  HPiPcc  '
  a.download = document.getElementsByClassName("AHFaub")[0].innerText;
  a.click();
   var doDownload = function(blob, filename) {
     var a = document.createElement('a');
     a.download = filename;
     a.href = blob;
     a.click();
}
  var container = document.getElementsByClassName("hfWwZc")[0];
  container.insertBefore(a,container.childNodes[0]);

  a.addEventListener('click', function (ev) {
  var blob = document.getElementsByClassName("xSyT2c")[0].childNodes[0].getAttribute('src').split("=s")[0]+"=s512";
  var filename = document.getElementsByClassName("AHFaub")[0].innerText;
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