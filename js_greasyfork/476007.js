// ==UserScript==
// @name                刪除萌娘百科背景水印
// @name:zh-CN          删除萌娘百科背景水印
// @namespace           https://zh.moegirl.org.cn/
// @version             0.2
// @description         刪除萌娘百科在歷史版本和使用者頁面加入的惱人水印。
// @description:zh-CN   删除萌娘百科在历史版本和用户页面加入的恼人水印。
// @match               https://zh.moegirl.org.cn/*
// @match               https://mzh.moegirl.org.cn/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @license             CC0-1.0
// @grant               none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/476007/%E5%88%AA%E9%99%A4%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/476007/%E5%88%AA%E9%99%A4%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Anti-ing');
    document.body.addEventListener('DOMSubtreeModified', mainm);
    function mainm(e){
        const a = document.body.querySelectorAll('[style*="background-image: url("][style*="data:image/svg+xml;base64"]');
        if (a) {
        a.forEach((f)=>{
            f.parentNode.removeChild(f);
        });
        }
        const b = document.body.querySelector('.fc-ab-root');
        if (b) {
            b.parentNode.removeChild(b);
            document.body.removeAttribute('style');
        }
    }
})();