// ==UserScript==
// @name         Google搜索、Github、YouTube点击链接打开新的标签页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google搜索、Github、YouTube点击链接时，在新的标签页打开链接网站
// @author       wxb
// @include      https://www.google.com/search?*
// @include      https://github.com/*
// @include      https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433814/Google%E6%90%9C%E7%B4%A2%E3%80%81Github%E3%80%81YouTube%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B0%E7%9A%84%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/433814/Google%E6%90%9C%E7%B4%A2%E3%80%81Github%E3%80%81YouTube%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E6%89%93%E5%BC%80%E6%96%B0%E7%9A%84%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // 是不是YouTube网站
     let isYouTube = location.origin === 'https://www.youtube.com';
     let arr = Array.from(document.getElementsByTagName("a"));
     arr.forEach(item=>{
         item.setAttribute("target","_blank");
         if(isYouTube){
            item.onclick = (e)=>{
                window.open(`${item.href}`);
                e.stopPropagation();
            }
         }

    })
})();