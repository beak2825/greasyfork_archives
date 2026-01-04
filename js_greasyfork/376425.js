// ==UserScript==
// @name         音乐聚合搜索引擎 无限下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.gequdaquan.net/gqss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376425/%E9%9F%B3%E4%B9%90%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%20%E6%97%A0%E9%99%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/376425/%E9%9F%B3%E4%B9%90%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%20%E6%97%A0%E9%99%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //从源代码中抠出来的check函数,负责检查下载次数是否已达两次 而我负责把这个函数重定义一次   ( ͡° ͜ʖ ͡°)
    //上面的方法太麻烦了
    //为html元素添加个 onmousemove 方法 ,鼠标动一下就把下载次数恢复为 0
    document.getElementsByTagName('html').setAttribute('onmousemove','window.localStorage.setItem("authDownNum", 0);');
    window.localStorage.getItem("authDownNum");
/*
window.localStorage.setItem("authDownNum", 0);  //设置下载次数为零
window.localStorage.getItem("authDownNum");     //查看当前下载次数
//这些都没啥用了
var s=document.getElementsByClassName("icon-download")   //获取下载按钮
s[0].setAttribute('onclick','window.localStorage.setItem("authDownNum", 0);'); 为下载按钮添加下载次数清零方法
*/


})();