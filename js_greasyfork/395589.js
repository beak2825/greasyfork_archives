// ==UserScript==
// @name         downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395589/downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395589/downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   setInterval(setDownloader, 1000);
   function setDownloader() {
       let link = document.getElementById('downloader');
       if (!link) {
           let link = document.createElement('a');
           link.innerText = "скачать видео";
           link.setAttribute('target', '_blank');
           link.setAttribute('id', 'downloader');
           document.getElementById('info-text').appendChild(link);
       }
       let hrefDownload = 'https://www.ssyoutube.com/watch' + window.location.search;
       link.setAttribute('href', hrefDownload);
   }
})();