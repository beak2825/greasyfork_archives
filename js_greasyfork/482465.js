// ==UserScript==
// @name         firefish 自动展开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动展开 firefish cw的内容。适配其它网站，可自行修改脚本，添加一行 @match 即可
// @author       uu
// @match        https://firefish.social/*
// @match        https://firefish.gethsemane.pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gethsemane.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482465/firefish%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/482465/firefish%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

function autoexpand() {
    'use strict';
    // Your code here...
    // console.log('插件运行开始');
    // var res = document.getElementsByClassName('wrmlmaau');
    var res = document.getElementsByClassName('showContent');
    // ((res[0].getElementsByTagName("button"))[0]).click();
    for (var i = 0; i < res.length; i++) {
        var items = res[i].getElementsByTagName("button");
        if (items.length != 0) {
            (items[0]).click();
        }
    }
    // console.log('插件运行结束');
};

// 每 2 s 运行一次
setInterval(function() {
    autoexpand();
}, 2000);

// window.onload = function () {
//     autoexpand();
// }

// $().ready(function () {
//     autoexpand();
// })

// function doSomething() {
//     console.info("DOM 加载了");
//     autoexpand();
// }

// if (document.readyState === "loading") {
//     // 此时加载尚未完成
//     document.addEventListener("DOMContentLoaded", doSomething);
// } else {
//     // `DOMContentLoaded` 已经被触发
//     doSomething();
// }
