/* jshint esversion: 6 */
// ==UserScript==
// @name         Accelerate WeChat to doc
// @name:zh-CN   702祖传代码
// @description:zh-cn Stay Hungry Stay Smart
// @version      0.1
// @description  word!word!word
// @author       Luka
// @match        *://mp.weixin.qq.com/*
// @Declare      Code from the network, improve the 
// @license      GNU General Public License v3.0 or later
// @namespace https://greasyfork.org/users/753871
// @downloadURL https://update.greasyfork.org/scripts/424338/Accelerate%20WeChat%20to%20doc.user.js
// @updateURL https://update.greasyfork.org/scripts/424338/Accelerate%20WeChat%20to%20doc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    

    document.querySelectorAll('img').forEach(item => {
        let src = item.dataset.src || item.src;
        if (src && src.match(/wx_fmt=(\w+)/)) {
            item.onload = e => {
                if (e.target.src != src) {
                    e.target.src = src;
                    e.target.classList.remove('img_loading');
                }
            };
            item.onerror = e => console.error(e);
        }
        var img = document.getElementsByTagName('img');
        for (var i=0;i<img.length;i++){
        if(img[i].src.toLowerCase().includes('webp')){
            if(img[i].outerHTML.toLowerCase().includes('jpeg')){
                img[i].src = img[i].src.replace(/webp/g,'jpeg');}
            else if(img[i].outerHTML.toLowerCase().includes('jpg')){
                img[i].src = img[i].src.replace(/webp/g,'jpg');}
            else if(img[i].outerHTML.toLowerCase().includes('png')){
                img[i].src = img[i].src.replace(/webp/g,'png');}
            else if(img[i].outerHTML.toLowerCase().includes('gif')){
                img[i].src = img[i].src.replace(/webp/g,'gif');}
            else{
                img[i].src = img[i].src.replace(/webp/g,'jpg');}
        }
    }
    });
})();