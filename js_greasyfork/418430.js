// ==UserScript==
// @name         萌百mzh页面自动跳转桌面版，b站/s域名跳转正常域名
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  修改自https://greasyfork.org/zh-CN/scripts/410244，未经过原作者同意。
// @author       黑田光
// @include      *://mzh.moegirl.org.cn/*
// @include      *://www.bilibili.com/s/*
// @include      *://m.hupu.com/bbs/*
// @include      *://jump2.bdimg.com/p/*
// @include      *://nga.178.com/*
// @include      *://yues.org/*
// @include      *://ngabbs.com/*
// @include      *://message.bilibili.com/#/*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/418430/%E8%90%8C%E7%99%BEmzh%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%A1%8C%E9%9D%A2%E7%89%88%EF%BC%8Cb%E7%AB%99s%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/418430/%E8%90%8C%E7%99%BEmzh%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%A1%8C%E9%9D%A2%E7%89%88%EF%BC%8Cb%E7%AB%99s%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC%E6%AD%A3%E5%B8%B8%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

document.location.href = document.location.href.
replace('mzh.moegirl.org.cn.cc', 'zh.moegirl.org.cn').
replace('mzh.moegirl.org.cn', 'zh.moegirl.org.cn').
replace('m.hupu.com/bbs/', 'bbs.hupu.com/').
replace('jump2.bdimg.com/p/', 'tieba.baidu.com/p/').
replace('www.bilibili.com/s/', 'www.bilibili.com/').
replace('zh-tw', 'zh-cn').
replace('ngabbs.com/', 'bbs.nga.cn/').
replace('yues.org/', 'bbs.nga.cn/').
replace('nga.178.com/', 'bbs.nga.cn/');
replace('message.bilibili.com/#/%2Freply=/', 'message.bilibili.com/#/reply/');