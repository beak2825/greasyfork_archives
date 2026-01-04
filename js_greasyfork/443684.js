// ==UserScript==
// @name         去除csdn的未登录禁止复制，复制的时候不携带版权声明
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  方便程序员的使用
// @author       xiaolajikiki
// @match        https://blog.csdn.net/*
// @match        https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuque.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443684/%E5%8E%BB%E9%99%A4csdn%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%A4%8D%E5%88%B6%E7%9A%84%E6%97%B6%E5%80%99%E4%B8%8D%E6%90%BA%E5%B8%A6%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/443684/%E5%8E%BB%E9%99%A4csdn%E7%9A%84%E6%9C%AA%E7%99%BB%E5%BD%95%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%A4%8D%E5%88%B6%E7%9A%84%E6%97%B6%E5%80%99%E4%B8%8D%E6%90%BA%E5%B8%A6%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 应该是js通过获取content_views进行逻辑判断的，所以我把这里的id改掉就可以进行复制了
    console.log(window.location.href);
    let yanzhengshifoubaobanjuejinAddress = /juejin/i;
    if(window.location.href.match(yanzhengshifoubaobanjuejinAddress)){
    }else{
        let divBiaoQian = document.getElementById("content_views");
        divBiaoQian.id = "";
        // 解决未登录需要关注博主才可以阅读全文，这不还得登录，这要解决一下
        // 这样就把它的自动隐藏移除掉了
        let removeDisplayContent = document.querySelector("#article_content").removeAttribute("style");
        // 把关注博主阅读全文这个标签移除掉
        let removeGuanZhuBiaoQian = document.querySelector(".hide-article-box").remove()
    }
    // 这样设置以后复制的时候就不会带版权声明之类的东西了
    [...document.querySelectorAll('*')].forEach(item=>{
    item.oncopy = function(e) {
        e.stopPropagation();
    }

});

})();