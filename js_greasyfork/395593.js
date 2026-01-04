// ==UserScript==
// @name         YTDL
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Простой загрузчик видео с YouTube
// @author       Denis_ist
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395593/YTDL.user.js
// @updateURL https://update.greasyfork.org/scripts/395593/YTDL.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(setDownloader,1000)
    // Your code here...
    function setDownloader(){
    let link = document.getElementById('downloader')
    let button =document.getElementById('downloader_button')
    if (!link) {
    button = document.createElement('button');
    link = document.createElement('a');
    link.innerText = "Загрузить";
    link.setAttribute('id','downloader');
    button.setAttribute('id','downloader_button')
    link.setAttribute('target','_blank' );
    document.getElementById("info-text").appendChild(button);
    document.getElementById('downloader_button').style.cssText= `
background-color:#DC3838;
  border:1px solid #DC3838;
border-radius:5px;
margin-left:5px
`;
    document.getElementById("downloader_button").appendChild(link);
    document.getElementById('downloader').style.cssText= `
      text-decoration:none;
  color:white;
  font-family:Verdana,sans-serif;
`;
    }
    let url_download = 'https://www.ssyoutube.com/watch'+window.location.search
    link.setAttribute('href',url_download );
    }
})();