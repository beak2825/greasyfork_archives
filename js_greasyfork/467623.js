// ==UserScript==
// @name         中关村去广告
// @namespace    http://tampermonkey.net/
// @description  主页和内容页
// @version      1.0.2
// @author       wangkaixuan
// @match        https://*.zol.com.cn/*
// @run-at       document-end
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/467623/%E4%B8%AD%E5%85%B3%E6%9D%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/467623/%E4%B8%AD%E5%85%B3%E6%9D%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

try{
var elementszu = document.querySelectorAll(".wrapper.bbs-wrap,.today-hot-layer,.gmine_ad,.n1-pad-entrance-wrap,.module-app");
for (var u = 0; u < elementszu.length; u++) {
    elementszu[u].remove();
}
}catch (err){}

try{
var elementszi = document.querySelectorAll(".aside,.headerbox,.top_bar,.container,center");
for (var i = 0; i < elementszi.length; i++) {
    elementszi[i].remove();
}
}catch (err){}
try{
            setTimeout(function() {
    var a = document.querySelector(".close");
    a.click();
        }, 1000);
}catch (err){
}
var article = document.querySelector(".wrapper");
var main = document.querySelector(".main");
article.style.width='760px';
main.style.width='760px';