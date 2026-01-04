// ==UserScript==
// @name         jq22.com插件库网站签到
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开jq22插件库网签到页面后自动点击每日签到，啊，我是真的懒，浏览器一键打开收藏夹列表，然后脚本全部自动点击签到，哈哈
// @author       wintercee
// @match        *www.jq22.com/myhome
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37854/jq22com%E6%8F%92%E4%BB%B6%E5%BA%93%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/37854/jq22com%E6%8F%92%E4%BB%B6%E5%BA%93%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
window.onload=function(){
    console.log(" JQ插件库网站签到运行中");
    document.getElementsByTagName('iframe')[1].contentWindow.document.getElementsByClassName('btn-success')[0].click();
};