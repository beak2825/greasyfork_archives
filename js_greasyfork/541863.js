// ==UserScript==
// @name         恢復Youtube搜尋圖片模糊化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  將搜尋結果中 YouTube 模糊化的圖片修正
// @author       shanlan(ChatGPT o3-mini)
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541863/%E6%81%A2%E5%BE%A9Youtube%E6%90%9C%E5%B0%8B%E5%9C%96%E7%89%87%E6%A8%A1%E7%B3%8A%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541863/%E6%81%A2%E5%BE%A9Youtube%E6%90%9C%E5%B0%8B%E5%9C%96%E7%89%87%E6%A8%A1%E7%B3%8A%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fixImages(){
        document.querySelectorAll('img').forEach(function(img){
            if(img.src.indexOf("i.ytimg.com/vi/") === -1) return;
            let src = img.src;
            if(src.indexOf("&rs=")!==-1){
                src = src.split("&rs=")[0];
            }
            src = src.replace(/(\d+)=?$/, '');
            if(img.src !== src) img.src = src;
        });
    }
    fixImages();
    const observer = new MutationObserver(fixImages);
    observer.observe(document.body, {childList: true, subtree: true});
})();