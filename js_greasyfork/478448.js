// ==UserScript==
// @name         bilibili-新版个人动态页优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  缩小新版个人动态页下面转评赞的间距，以及限制图片尺寸
// @author       Y_jun
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478448/bilibili-%E6%96%B0%E7%89%88%E4%B8%AA%E4%BA%BA%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/478448/bilibili-%E6%96%B0%E7%89%88%E4%B8%AA%E4%BA%BA%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(() => {
        const footerElems = document.querySelectorAll('.bili-dyn-item__footer');
        const albumElems = document.querySelectorAll('.bili-album');
        for(const footerElem of footerElems){
            if(footerElem.style.justifyContent!=='flex-start'){
                footerElem.style.justifyContent='flex-start';
            }
        }
        for(const albumElem of albumElems){
            if(!albumElem.style.width){
                albumElem.style.width='518px';
            }
        }
    }, 250);

})();