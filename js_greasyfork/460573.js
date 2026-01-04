// ==UserScript==
// @name         Bing 链接颜色修复
// @namespace    https://blog.csdn.net/qq_32917155
// @author       neelife
// @version      0.2
// @description  该脚本修复Bing 搜索结果全部变为紫色的问题, 使未访问链接重新恢复为蓝色
// @license MIT
// @match        https://*.bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/460573/Bing%20%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/460573/Bing%20%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==


// 修改下面的RGB值改变未访问链接的颜色
var unvisitcolor= "#4773e0"


var style = document.createElement('style');
style.innerHTML =`#b_results > li a:link{color: ${unvisitcolor}}`;
var ref = document.querySelector('script');
ref.parentNode.insertBefore(style, ref);