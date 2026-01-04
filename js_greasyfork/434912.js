// ==UserScript==
// @name         XYLinkTool
// @namespace    http://blog.devwiki.net/
// @version      0.1
// @description  小鱼易连工具
// @author       DevWiki
// @match        http://wiki.xylink.com:*/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/434912/XYLinkTool.user.js
// @updateURL https://update.greasyfork.org/scripts/434912/XYLinkTool.meta.js
// ==/UserScript==
 
/*
v0.1
1.支持替换wiki文档中图片地址
2.支持替换wiki文档的接口地址
*/
 
/* 替换wiki的图片 */
var _self = document.querySelectorAll("img");
var i;
for (i = 0; i < _self.length; i++) {
    _self[i].src = _self[i].src.replace("172.20.36.32", "wiki.xylink.com");
   if(_self[i].hasAttribute("data-image-src")){
        var oldValue = _self[i].getAttribute("data-image-src");
        var newValue = oldValue.replace("172.20.36.32", "wiki.xylink.com");
        _self[i].setAttribute("data-image-src", newValue);
    }
}
 
/* 替换wiki的接口 */
var _self = document.querySelectorAll("a");
var i;
for (i = 0; i < _self.length; i++) {
    _self[i].href = _self[i].href.replace("172.20.35.247", "yapi.xylink.com");
}