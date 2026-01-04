// ==UserScript==
// @name             xvideos video downloader
// @namespace        http://tampermonkey.net/
// @version          0.2
// @description:es   Descargar videos de la pagina de adultos xvideos con tubeninja.net sin necesidad de registrarse
// @description      Download videos from the adult site xvideos with tubeninja.net without registering
// @author           Alexito
// @match            https://www.xvideos.com/*
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/426244/xvideos%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/426244/xvideos%20video%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(setLoader, 1000);

function setLoader(){
    let link = document.getElementById('loader');
    if(!link){
    link = document.createElement('a');
    link.innerText = 'Download';
    link.setAttribute('target', '_blank');
    link.setAttribute('id', 'loader');
    document.querySelector('#video-tabs').appendChild(link);
    let btnOfLink = document.createElement('button');
    document.querySelector('#video-tabs').appendChild(btnOfLink);
    btnOfLink.appendChild(link);
    btnOfLink.setAttribute('class', 'stylish');
    let stylishBtn = document.querySelector('.stylish');
    stylishBtn.style.backgroundColor = '#999';
    stylishBtn.style.margin = '0px';
    stylishBtn.style.display = 'contents';
    stylishBtn.style.position = 'relative';
    link.style.textDecoration = 'none';
    link.style.color = 'red';
    link.style.fontFamily ='Curier';
    link.style.fontSize = '12px';
    document.querySelector('#video-tabs').style.padding='1px';

    }
      let hrefLoad ='https://www.tubeninja.net/welcome?url=' + window.location;
      link.setAttribute('href', hrefLoad);
    }
 })();