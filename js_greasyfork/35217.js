// ==UserScript==
// @name         Taobao fix - Shop Home
// @namespace    https://greasyfork.org/zh-CN/users/159393-zwwooooo
// @version      0.1
// @description  临时修复火狐访问淘宝店铺首页的图片问题。
// @author       zwwooooo
// @include     *.taobao.com
// @include     *.taobao.com/
// @include     *.taobao.com/index.htm*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/35217/Taobao%20fix%20-%20Shop%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/35217/Taobao%20fix%20-%20Shop%20Home.meta.js
// ==/UserScript==

// var imgs = document.getElementsByTagName("img");
var imgs = document.querySelectorAll("[data-ks-lazyload]");
for (var i=0;i<imgs.length;i++) {
    imgs[i].setAttribute("src", imgs[i].getAttribute("data-ks-lazyload"));
}