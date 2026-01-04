// ==UserScript==
// @name         Bilibili视频选集标题显示完整
// @namespace    http://tampermonkey.net/

// @version      0.7
// @description  让标题显示完整~try to change Bilibili Directory Width!
// @author       HitLittleFox
// @license      AGPL-3.0
// @match        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431806/Bilibili%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/431806/Bilibili%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var changeDirectoryWidth = document.querySelector(".multi-page-v1 .cur-list .list-box")
    changeDirectoryWidth.offsetParent.style.width="fit-content"
    var changeDirectoryWidth2 = document.querySelector(".list-box")
    var count=document.querySelector(".list-box").childElementCount
    var i=0
    for(i=0;i<count-1;i++){
    changeDirectoryWidth2.children[i].style.width="fit-content"
    }
})();