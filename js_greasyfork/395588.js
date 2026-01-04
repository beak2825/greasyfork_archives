// ==UserScript==
// @name       YouTubeDownloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yudjin
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395588/YouTubeDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395588/YouTubeDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(setDownloader,1000)
  function setDownloader() {
      let link = document.getElementById('downloader');
      if(!link) {
         let link = document.createElement('a');
         link.innerText = "Скачать видос";
         link.setAttribute('target','_blank');
         link.setAttribute('id', 'downloader');
         document.getElementById('info-text').appendChild(link);
  }
      let hrefDownload = 'https://www.ssyoutube.com/watch' + window.location.search;
      link.setAttribute('href', hrefDownload);
  }
})();