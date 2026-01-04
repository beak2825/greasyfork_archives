// ==UserScript==
// @name       去黑白滤镜
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  国内常见视频， 购物网站去黑白滤镜
// @author       carlos
// @match        *://*.jd.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.taobao.com/*
// @match        *://*.youku.com/*
// @match        *://*.tmall.com/*
// @match        *://*.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455987/%E5%8E%BB%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455987/%E5%8E%BB%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    addNewStyle();
    setTimeout(function(){ addNewStyle(); },100);
})();

function addNewStyle(newStyle) {
    //youku
    document.documentElement.style.filter='none'
    //bilibili iqiyi
    var grayElements = document.getElementsByClassName("gray")
    if(grayElements.length >0){
        grayElements[0].removeAttribute('class');
    }
    console.log("clean");
}
