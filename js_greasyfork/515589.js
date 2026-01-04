// ==UserScript==
// @name		WAP贴吧重定向
// @namespace	        https://greasyfork.org/zh-CN/scripts/515589
// @version		0.1.6
// @description	        把贴吧重定向为WAP版
// @author		f59375443
// @match		*://*.baidu.com/*
// @match		*://www.tieba.com/*
// @match		*://jump2.bdimg.com/*
// @match		*://uf9kyh.smartapps.cn/*
// @match		*://tieba.baidu.com/p/*
// @license		MIT
// @grant		none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/515589/WAP%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/515589/WAP%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

var url = window.location.href;
var match = url.match(/\/p\/(\d+)/);
if (match) {
    var pageNumber = match[1];
    // 生成重定向URL
    var redirectUrl = "https://tieba.baidu.com/mo/q---332AA4856294550118AD9656FC7BE%3AFG%3D1--1-3-0--2--wapp_1699082824467_956/m?kz=" + pageNumber;
    // 重定向
    window.location.href = redirectUrl;
}
