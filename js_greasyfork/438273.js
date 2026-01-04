// ==UserScript==
// @name         Microsoft Edge浏览器新标签页自动跳转到指定搜索引擎
// @namespace    none
// @version      0.04
// @description  测试
// @author       DuckBurnIncense
// @match        *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438273/Microsoft%20Edge%E6%B5%8F%E8%A7%88%E5%99%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/438273/Microsoft%20Edge%E6%B5%8F%E8%A7%88%E5%99%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%8C%87%E5%AE%9A%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

var str = window.location.href;
if(str.indexOf("://ntp.msn.cn/edge/ntp") != -1)
{
    window.location.href="www.baidu.com";
}
