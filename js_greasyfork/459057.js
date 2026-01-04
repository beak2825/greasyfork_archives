// ==UserScript==
// @name         抖音视频去水印下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  抖音视频去水印下载，打开抖音分享链接
// @author       You
// @match        https://www.douyin.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459057/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/459057/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //    window.onload = () => {
    const res = document.querySelector('source').src;
    const div = document.createElement('div');
    div.setAttribute('id', 'lrx1');
    div.style.position = 'fixed'
    div.style.backgroundColor = '#eeeeeeee'
    div.style.maxWidth = '20em'
    div.style.zIndex = 999;
    div.style.left = '0'
    div.style.top = '0'
    div.style.minWidth = '5em'
    div.style.textAlign='center'
    div.style.padding = '10px'
    div.style.transition = 'all ease 200ms'
    div.innerHTML = '已经复制到剪切板';
    navigator.clipboard.writeText(res).then(res=>{
        document.body.appendChild(div);
    });

    //    }
    // Your code here...
})();