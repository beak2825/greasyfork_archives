// ==UserScript==
// @name         安徽继续教育在线刷课
// @namespace    http://tampermonkey.net/
// @version      2024-03-04
// @description  Lazy lady's joke.
// @author       Cathryn
// @match        https://main.ahjxjy.cn/study/html/content/studying/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ahjxjy.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488937/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/488937/%E5%AE%89%E5%BE%BD%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

setInterval (function(){
    if(document.getElementsByClassName('jw-progress jw-reset')[0].style.width > '99%') {
        setTimeout(function(){
            document.getElementsByClassName('btn btn-green')[0].click();
        },10000);
    }
},3000);

var button = document.getElementsByClassName('btn btn-green');
    setInterval(function(){
        button[0].click();
    },
    1500);