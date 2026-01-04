// ==UserScript==
// @name               手机财新博客-拒绝app
// @name:en            handy-Caixin_Blog
// @namespace          http://blog.caixin.com/
// @version            0.0.1
// @description        拒绝安装app,手机直接看文章隐藏详细内容
// @description:en     free
// @author             ok!
// @match              http*://*.blog.caixin.com/*
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/408103/%E6%89%8B%E6%9C%BA%E8%B4%A2%E6%96%B0%E5%8D%9A%E5%AE%A2-%E6%8B%92%E7%BB%9Dapp.user.js
// @updateURL https://update.greasyfork.org/scripts/408103/%E6%89%8B%E6%9C%BA%E8%B4%A2%E6%96%B0%E5%8D%9A%E5%AE%A2-%E6%8B%92%E7%BB%9Dapp.meta.js
// ==/UserScript==

window.onload=function (e) {
    if(document.querySelector('#Main_Content_Val')){
document.querySelector('#Main_Content_Val').style.overflow="auto";}}