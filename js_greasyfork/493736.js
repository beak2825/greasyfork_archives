// ==UserScript==
// @name               网页财新博客-免登录查看全文
// @name:en            free-Caixin_Blog
// @namespace          http://blog.caixin.com/
// @version            0.0.1
// @description        免登录,网页端直接看博客文章隐藏详细内容
// @description:en     free
// @author             easilylazy
// @match              http*://*.blog.caixin.com/*
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/493736/%E7%BD%91%E9%A1%B5%E8%B4%A2%E6%96%B0%E5%8D%9A%E5%AE%A2-%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/493736/%E7%BD%91%E9%A1%B5%E8%B4%A2%E6%96%B0%E5%8D%9A%E5%AE%A2-%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

window.onload=function (e) {
    if(document.querySelector('#the_content')){
        document.querySelector('#the_content').style.overflow="scroll";}
    var element = document.getElementById("loginWall");
    element.parentNode.removeChild(element);
}