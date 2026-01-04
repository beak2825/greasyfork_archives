// ==UserScript==
// @name:zh-CN 百度Logo去“网页版”字样
// @name Replace Baidu Logo
// @namespace beta
// @author JackieLee
// @description:zh-CN 用于去掉百度Logo中“网页版”字样。
// @include https://www.baidu.com/*
// @version 1.01
// @grant none
// @description 用于去掉百度Logo中“网页版”字样。
// @downloadURL https://update.greasyfork.org/scripts/40066/Replace%20Baidu%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/40066/Replace%20Baidu%20Logo.meta.js
// ==/UserScript==

var reg = new RegExp('/img/pc.*_.*.png');
var images = document.querySelectorAll('img');
var i, image;
for (i = 0; i < images.length; i += 1) {
image = images[i];
if (image.src.match(reg)) {
image.src = image.src.replace(/pcindex_.*\.png/,'bd_logo1.png');
image.src = image.src.replace(/pcse_.*\.png/,'baidu_jgylogo3.gif');
}
}