// ==UserScript==
// @name         ❤黑白网页恢复❤
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description   需要恢复的网页按照下面的格式加入进来就行
// @match        *://tieba.baidu.com/*
// @match        *://www.taobao.com/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455703/%E2%9D%A4%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E2%9D%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/455703/%E2%9D%A4%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E2%9D%A4.meta.js
// ==/UserScript==

(function() {
    var abc = document.createElement('style');
    abc.type = 'text/css';
    abc.id='huifu'
    document.getElementsByTagName('head')[0].appendChild(abc);//加入到head中
    // -o 是open浏览器，-MS是IE，-MOZ是火狐，
    abc.appendChild(document.createTextNode("*{-webkit-filter:grayscale(0)}"));
    abc.appendChild(document.createTextNode("*{-webkit-filter:none!important;}"));
    abc.appendChild(document.createTextNode("*{-o-filter:none!important;}"));
    abc.appendChild(document.createTextNode("*{-moz-filter:none!important;}"));
    abc.appendChild(document.createTextNode("*{-ms-filter:none!important;}"));

// 增加一个恢复黑白效果的功能按钮，位于屏幕左边
//    window.onload=function(){
//     var abcd =document.createElement('div');
//     abcd.id='fuzhi';
//     abcd.textContent='黑白';
//     document.getElementsByTagName('body')[0].appendChild(abcd);
//     var xxx=document.createElement('style');
//     xxx.type = 'text/css';
//     xxx.innerText='#fuzhi{padding: 10px; background: rgba(0,0,0,0.5);position: fixed; left:0; top: 40%;cursor: pointer;color: #fff; z-index: 99999;}';
//    document.getElementsByTagName('head')[0].appendChild(xxx)
//     abcd.onclick=function(){
//      var ddd=document.getElementById('huifu');
//          ddd.innerText='';
//     }
//    }
// 非专业前端，自己理解着写的，兄弟们有问题请指教 
})();