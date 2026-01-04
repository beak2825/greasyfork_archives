// ==UserScript==
// @name         [失效]B站使用贝壳换取B币
// @namespace    https://pay.bilibili.com
// @version      1.0.1-died
// @description  【该脚本已失效】什么？你还在因为没有实名认证或没有银行卡而苦恼？你还在因为B站发工资慢而苦恼？快使用本脚本，一键把你的贝壳换成B币吧！（使用方式看代码内注释）
// @author       ghostming
// @match        http*://pay.bilibili.com/bk_to_bb.html
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369631/%5B%E5%A4%B1%E6%95%88%5DB%E7%AB%99%E4%BD%BF%E7%94%A8%E8%B4%9D%E5%A3%B3%E6%8D%A2%E5%8F%96B%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/369631/%5B%E5%A4%B1%E6%95%88%5DB%E7%AB%99%E4%BD%BF%E7%94%A8%E8%B4%9D%E5%A3%B3%E6%8D%A2%E5%8F%96B%E5%B8%81.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
	let msg = document.querySelector('.error-container');
	if (!msg) return;
	location.replace(
	location.href.replace(/\:\/\/pay\.bilibili\.com\/bk_to_bb.html/, '://pay.bilibili.com/bb_exchange.html'));//浏览器中输入https://pay.bilibili.com/bk_to_bb.html即自动跳转至兑换页面
}, false);