// ==UserScript==
// @name         Dcard下載文章影片
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  影片上方會有下載影片按鈕，點一下就可以進去下載影片，如果沒有出現下載影片按鈕請按F5重新整理。
// @author       Yuki.kaco
// @match        *://*.dcard.tw/*
// @icon         https://www.dcard.tw/_next/static/media/93a7e0749e4edfb00cf4ad4a6c1eb6c6-512.png
// @grant window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477714/Dcard%E4%B8%8B%E8%BC%89%E6%96%87%E7%AB%A0%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/477714/Dcard%E4%B8%8B%E8%BC%89%E6%96%87%E7%AB%A0%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', setTimeout(setup, 3000));
    if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => setTimeout(setup, 3000));
}

    function acessLink(dataurl) {
        const a = document.createElement("a");
        a.href = dataurl;
        a.target = "_blank";
        a.click();
    }

    function setup(){
        console.log('Yuki Setup')
        if(document.head.querySelector("[property='og:image']").content.split('/')[3] != 'videos') return;
        let download =document.createElement("button");
        download.innerText="下載影片";
        download.style.background="#3397CF";
        download.style.color="#ffffff";
        download.onclick=function(){
            var url = document.head.querySelector("[property='og:image']").content.split('thumbnails');
            var videoLink = url[0].concat('orig')
            acessLink(videoLink)
        };

        let title=document.querySelector('[data-auto-play-post]');
        title.parentElement.insertBefore(download,title);
    }


})();