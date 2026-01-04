// ==UserScript==
// @license MIT
// @name      block百度
// @namespace com.ct
// @version    0.0.1
// @match http://www.baidu.com/*
// @match https://www.baidu.com/*
// @description 自动从百度跳转到必应
// @downloadURL https://update.greasyfork.org/scripts/463742/block%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/463742/block%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

function baiduRedirectToBingSerach() {
    window.open("https://www.bing.com/search?q=" + $('#kw') .val(), "_self");
}
function baiduHomeRedirectToBingHome() {
    window.open("https://www.bing.com", "_self");
}
if(window.location.search.lastIndexOf("wd=")>0 || window.location.search.lastIndexOf("word=")>0){
    baiduRedirectToBingSerach();
}else{
    if(window.location.href == "https://www.baidu.com/"){
        baiduHomeRedirectToBingHome()
    }
}
