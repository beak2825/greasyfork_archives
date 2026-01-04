// ==UserScript==
// @name 原页面打开
// @namespace undefined
// @version 0.2
// @description 强制哔哩哔哩的链接在原页面打开
// @match https://*.bilibili.com/*
// @match http://*.bilibili.com/*
// @match https://*.baidu.com/*
// @include     member.bilibili.com/*
// @include     message.bilibili.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/396288/%E5%8E%9F%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/396288/%E5%8E%9F%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
document.body.addEventListener('mousedown', function (e) {
	e.target.target = '_top';
    e.target.parentNode.target='_top';
	e.target.parentNode.parentNode.target='_top';
	e.target.parentNode.parentNode.parentNode.target='_top';
	e.target.parentNode.parentNode.parentNode.parentNode.target='_top';
})
