// ==UserScript==
// @name         Download_UralskiePelmeni
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавляет ссылку для скачивания видео выпусков "Уральские пельмени" со страницы Youtube
// @author       Vera
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395594/Download_UralskiePelmeni.user.js
// @updateURL https://update.greasyfork.org/scripts/395594/Download_UralskiePelmeni.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   setInterval(setDownloader, 2000)
   function setDownloader() {
   let Link = document.getElementById('downloader');
   if (!Link) {
   Link = document.createElement('a')
   Link.innerText = "Скачать текст"
   Link.setAttribute ('target', '_blank')
   Link.setAttribute ('id', 'downloader')
   document.getElementById('info').appendChild(Link)
   Link.innerText = 'Download'
   }
   let hrefDownload = 'https://www.ssyoutube.com/watch' + window.location.search
   Link.setAttribute ('href', hrefDownload)
   }
})();