// ==UserScript==
// @name         文库clear
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去广告，展开全文
// @author       You
// @icon         https://www.baidu.com/cache/icon/favicon.ico
// @match        http://wenku.baidu.com/*
// @match        https://wenku.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376537/%E6%96%87%E5%BA%93clear.user.js
// @updateURL https://update.greasyfork.org/scripts/376537/%E6%96%87%E5%BA%93clear.meta.js
// ==/UserScript==

(function() {
'use strict';
var bannerInterval = 3500;//文中广告
var readInterval = 4000;//展开全文
setTimeout(function(){
var banner=document.getElementsByClassName("banner-ad");
for(var m = (banner.length - 1); m>=0; m--){
            if(banner[m].tagName== "DIV") {
                    banner[m].remove();}
}},bannerInterval);
setTimeout(function(){
    document.getElementsByClassName("moreBtn")[0].click();},readInterval);
//底部悬浮广告
function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
}
addGlobalStyle(`
#lastcell-dialog{display:none;
visibility:hidden;}`);
    // Your code here...
 })();