// ==UserScript==
// @name 新标签页打开Ubuntu中文论坛链接
// @version 0.0.1
// @namespace lihuiyuan.summerhost.info
// @description 目前Ubuntu中文论坛在当前页面打开链接，这个脚本的作用是：在新标签页打开Ubuntu中文论坛的链接！
// @include https://forum.ubuntu.org.cn/*
// @include http://forum.ubuntu.org.cn/*
// @author RayJing
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/381989/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80Ubuntu%E4%B8%AD%E6%96%87%E8%AE%BA%E5%9D%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/381989/%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80Ubuntu%E4%B8%AD%E6%96%87%E8%AE%BA%E5%9D%9B%E9%93%BE%E6%8E%A5.meta.js
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