// ==UserScript==
// @name         Hello, TamperMonkey
// @namespace    http://blog.chaofan.io/
// @version      0.4-alpha
// @description  Hello world of a tampermonkey script
// @author       Chaofan
// @match        http://www.woyushu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392911/Hello%2C%20TamperMonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/392911/Hello%2C%20TamperMonkey.meta.js
// ==/UserScript==
function visit(){
    var xmlhttp=new XMLHttpRequest();
    var url="https://book.douban.com/";
    console.log('visit',url);
   
    xmlhttp.open("GET",url,true); //第三个参数是同步异步,主线程只能异步
    xmlhttp.onreadystatechange=visit;
    xmlhttp.send();
}
(function() {
    'use strict';
    alert('Hello, world!');
    visit();
})();