// ==UserScript==
// @name 新标签页打开谷歌学术搜索结果链接
// @version 0.2.0
// @created        2015-7-24
// @lastUpdated    2016-3-28
// @namespace https://greasyfork.org/zh-CN/users/35510-rayjing
// @homepage  https://greasyfork.org/zh-CN/users/35510-rayjing
// @description 目前谷歌学术在当前页面打开链接，这个脚本的作用是：在新标签页打开谷歌学术搜索结果的链接！
// @include http://scholar.google.com/*
// @include https://scholar.google.com/*
// @include http://scholar.google.com.hk/*
// @include https://scholar.google.com.hk/*
// @include http://scholar.google.cn/*
// @include https://scholar.google.cn/*
// @author RayJing & 感谢另一个类似脚本作者
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/18316/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/18316/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

"use strict";

function getAnchor(element) {
while (element && element.nodeName != "A") {
element = element.parentNode;
}
return element;
}

document.addEventListener("click", function(e){
var anchor = getAnchor(e.target);
if (!anchor || anchor.target || anchor.protocol == "javascript:" || e.isTrusted === false || !anchor.offsetParent || (e.isTrusted == null && !e.detail)) {
return;
}
if (anchor.hostname != location.hostname) {
anchor.target = "_blank";
}
});