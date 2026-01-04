// ==UserScript==
// @icon         https://sf.taobao.com/favicon.ico
// @name         淘宝法拍名字助手
// @namespace    taobao_sf_name_shower
// @version      0.3
// @description  淘宝司法拍卖的名字照片alt在Chrome里hover并不显示，title使用alt的值即可
// @author       sanhu88
// @match        https://sf.taobao.com/*
// @connect      sf.taobao.com
// @grant        GM_addStyle
// @charset		 UTF-8
// @homepageURL  https://github.com/sanhu88/tamperMonkeyScripts
// @supportURL   https://github.com/sanhu88/tamperMonkeyScripts/issues
// @license      GPL-3.0
// @compatible   Chrome

// @downloadURL https://update.greasyfork.org/scripts/404122/%E6%B7%98%E5%AE%9D%E6%B3%95%E6%8B%8D%E5%90%8D%E5%AD%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404122/%E6%B7%98%E5%AE%9D%E6%B3%95%E6%8B%8D%E5%90%8D%E5%AD%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

GM_addStyle('.module {display: none;}');//移除顶部一个banner广告

//@run-at       document-end/document-idle 测试过没效果
//window.onload = function() { /* 脚本代码 */ }; 可行方案

window.onload = function() {
    const all_title = document.querySelectorAll('p[class ="title"]');
    for (let item of all_title){
        item.title = item.innerText
    }
};

//以下为0.2版本 代码
//window.onload = function() {
//const all = document.querySelectorAll('img[class ="pic"]');  //0.2版本 更新的是img
    //for (let item of all){
    //    item.title = item.alt
    //}
//}

//console 里核心的一个for循环就可以的，但是脚本就需要setTimeout延迟执行脚本,
// 以下为0.1版本 代码
//setTimeout(function(){ //alert("Hello");
//const second_item = document.querySelector("#pai-item-614180569936 > a > div.header-section > img");
//second_item.title = "second_item";
//    const all = document.querySelectorAll('img[class ="pic"]');
//    for (let item of all){
//        item.title = item.alt
//    }
//}, 1000);
