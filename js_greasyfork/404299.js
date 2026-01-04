// ==UserScript==
// @name         bilibili显示封面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  右侧广告区域显示视频封面图
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404299/bilibili%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/404299/bilibili%E6%98%BE%E7%A4%BA%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const coverImgUrl = document.head.querySelector('[itemprop="image"]').getAttribute('content').replace('http','https')
    const link = document.createElement('a')
    const title = document.querySelector('h1.video-title').innerText
    link.href = coverImgUrl
    link.setAttribute('target','_blank')
    link.id = 'link'
    const coverImg = document.createElement('img')
    coverImg.id='coverImg'
    coverImg.src = coverImgUrl
    coverImg.width = '320'
    coverImg.style.height = 'auto'
    coverImg.style.minHeight = '186px'
    coverImg.setAttribute('title',title)
    link.appendChild(coverImg)

    const targetNode = document.getElementById('slide_ad');
    targetNode.innerHTML = ''
    targetNode.appendChild(link)

    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList) {
        mutationsList.forEach(function (item, index) {
            if(Array.from(item.removedNodes).find((item)=>item.id==='link')){
                targetNode.innerHTML = ''
                targetNode.appendChild(link)
                observer.disconnect();
            }
        });
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();