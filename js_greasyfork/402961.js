// ==UserScript==
// @name         载入页面后自动刷新一次
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       抄的
// @match        https://keep.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402961/%E8%BD%BD%E5%85%A5%E9%A1%B5%E9%9D%A2%E5%90%8E%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%B8%80%E6%AC%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/402961/%E8%BD%BD%E5%85%A5%E9%A1%B5%E9%9D%A2%E5%90%8E%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%B8%80%E6%AC%A1.meta.js
// ==/UserScript==
window.onload = function(){
    if(location.href.indexOf('#reloaded')==-1){
    location.href=location.href+"#reloaded";
    location.reload();
    }
    }