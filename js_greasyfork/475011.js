// ==UserScript==
// @name            Xvideos download videos in hd with yt-dlp
// @namespace        https://greasyfork.org/es/users/758165-AlÉxito
// @include           https://www.xvideos.com/*
// @version           0.1
// @author            AlExito
// @description         Xvideos download videos in HD 1080p or at the highest resolution available and at high speed with yt-dlp.exe
// @license           MIT   feel free to modify improve and share
// @icon             https://static-cdn77.xvideos-cdn.com/v3/img/skins/default/logo/xv.black.16.png
// @downloadURL https://update.greasyfork.org/scripts/475011/Xvideos%20download%20videos%20in%20hd%20with%20yt-dlp.user.js
// @updateURL https://update.greasyfork.org/scripts/475011/Xvideos%20download%20videos%20in%20hd%20with%20yt-dlp.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(setLoader, 1000);

function setLoader(){
    let link = document.getElementById('xloader');
    if(!link){
    link = document.createElement('a');
    link.innerText = 'Donxxxload';
    link.setAttribute('target', '_self');
    link.setAttribute('id', 'xloader');
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
    link.style.color = 'red';
    document.querySelector('#video-tabs').style.padding='1px';

    }
      let hrefLoad ='ytdlp://' + window.location;
      link.setAttribute('href', hrefLoad);
    }
 })();