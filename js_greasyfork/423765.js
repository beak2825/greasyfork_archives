// ==UserScript==
// @name         MuseumQiu
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  用来在下载 museothyssen 高清大图的脚本
// @author       Money
// @match        *://*.museothyssen.org/en/collection/artists*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423765/MuseumQiu.user.js
// @updateURL https://update.greasyfork.org/scripts/423765/MuseumQiu.meta.js
// ==/UserScript==

(function() {
  // Your code here...
   var a = document.createElement('a');
  a.innerHTML = 'DONWLOAD FULL SIZE IMAGE';
  a.className = 'btn btn-primary-outline btn-block btn--icon-right gtm-btn-obra-descargar-1 js-popup-inline'
  a.download = document.getElementsByClassName("leading u-mb--@xs")[0].innerText;
  a.click();
   var doDownload = function(blob, filename) {
     var a = document.createElement('a');
     a.download = filename;
     a.href = blob;
     a.click();
}
  var container = document.getElementsByClassName("u-mb@xs u-mb+@md hidden-print")[0];
  container.insertBefore(a,container.childNodes[3]);

  a.addEventListener('click', function (ev) {
  var blob = document.getElementsByClassName("btn btn-primary-outline btn-block btn--icon-right js-show-zoom-map gtm-btn-obra-zoom-btn")[0].getAttribute('data-href');
  var filename = document.getElementsByClassName("leading u-mb--@xs")[0].innerText;
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