// ==UserScript==
// @name                        防止垃圾站将父窗口跳转脚本
// @description         在搜索引擎打开某些垃圾网站，会将搜索引擎跳转到其他页面，如果是跳转到一个高仿的登录界面呢？所以写这个脚本消除这种安全隐患（打开任意外站链接其实都有这隐患），此脚本用于解决 window.opener.location / window.opener.location.replace 存在的安全风险。
// @namespace   mh8xyk6hrntqalgcgxpwth32yi3zvpcl
// @author                      ejin
// @match        *
// @version                     2016.09.15.2
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/19615/%E9%98%B2%E6%AD%A2%E5%9E%83%E5%9C%BE%E7%AB%99%E5%B0%86%E7%88%B6%E7%AA%97%E5%8F%A3%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/19615/%E9%98%B2%E6%AD%A2%E5%9E%83%E5%9C%BE%E7%AB%99%E5%B0%86%E7%88%B6%E7%AA%97%E5%8F%A3%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


// 2016.05.12 建立脚本 脚本发布页面 https://greasyfork.org/zh-CN/scripts/19615-%E9%98%B2%E6%AD%A2%E5%9E%83%E5%9C%BE%E7%AB%99%E5%B0%86%E7%88%B6%E7%AA%97%E5%8F%A3%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC
if ( document.location.protocol.indexOf("http") != -1 && (document.referrer.indexOf(location.href.split("/")[2]) == -1 || document.referrer.indexOf(location.href.split("/")[2]) > 10) ) {
	parent.window.opener=null; // 来源非本站时，禁掉parent.window.opener，防止js判断存在父窗口
}