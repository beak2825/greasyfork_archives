// ==UserScript==
// @name         破解防复制
// @version      0.0.1
// @description  破解防复制，51CTO
// @author       zyl
// @include      https://blog.51cto.com/*
// @license 
// @grant none
// @namespace https://greasyfork.org/users/16216
// @downloadURL https://update.greasyfork.org/scripts/485199/%E7%A0%B4%E8%A7%A3%E9%98%B2%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485199/%E7%A0%B4%E8%A7%A3%E9%98%B2%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
 
document.body.oncopy=null; //去掉当前设置的复制监听
document.body.__defineSetter__("oncopy",function(){}); //禁止修改复制监听