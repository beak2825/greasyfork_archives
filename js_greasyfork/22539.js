// ==UserScript==
// @name           网页自动跳转https
// @namespace 网页自动跳转https脚本
// @description    百度(云盘/图片/知道)，自动跳转https
// @match       http://pan.baidu.com/*
// @match       http://yun.baidu.com/*
// @match       http://image.baidu.com/*
// @match       http://zhidao.baidu.com/*
// run-at       document-start
// @version 2017.3.26
// @downloadURL https://update.greasyfork.org/scripts/22539/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AChttps.user.js
// @updateURL https://update.greasyfork.org/scripts/22539/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AChttps.meta.js
// ==/UserScript==

if (location.protocol=='http:') location.protocol = "https:";