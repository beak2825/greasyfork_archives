// ==UserScript==
// @name         Youtube Downloader
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Youtube video Downloader
// @author       Anastasia Mukhlynina
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395587/Youtube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/395587/Youtube%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
setInterval(setDownLoader, 1000);

function setDownLoader(){
    let link = document.getElementById('downloader');
    if(!link){
    link = document.createElement('a');
    link.innerText = 'Скачать';
    link.setAttribute('target', '_blank');
    link.setAttribute('id', 'downloader');
    document.querySelector('#info-text').appendChild(link);
    let btnOfLink = document.createElement('button');
    document.querySelector('#info-text').appendChild(btnOfLink);
    btnOfLink.appendChild(link);
    btnOfLink.setAttribute('class', 'stylish');
    let stylishBtn = document.querySelector('.stylish');
    stylishBtn.style.backgroundColor = 'red';
    stylishBtn.style.margin = '1px';
    stylishBtn.style.outlineColor = 'white';
    link.style.textDecoration = 'none';
    link.style.color = 'white';
    link.style.fontFamily ='Roboto';
    link.style.fontSize = '10px';
    document.querySelector('#info-text').style.padding='5px';

    }
      let hrefDownload ='https://www.ssyoutube.com/watch' + window.location.search;
      link.setAttribute('href', hrefDownload);

    }

 })();