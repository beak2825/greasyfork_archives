// ==UserScript==
// @name         Bilibili 2x B站网页版 播放默认两倍速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站网页版 播放默认两倍速
// @author       Kongzz
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388721/Bilibili%202x%20B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%20%E6%92%AD%E6%94%BE%E9%BB%98%E8%AE%A4%E4%B8%A4%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/388721/Bilibili%202x%20B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%20%E6%92%AD%E6%94%BE%E9%BB%98%E8%AE%A4%E4%B8%A4%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        document.querySelector("video").playbackRate = 2;
; }, 3000);

  
})();