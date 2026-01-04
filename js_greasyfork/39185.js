// ==UserScript==
// @name         破解360doc防复制系统zz
// @version      1.2
// @description  破解360doc防复制系统（不登陆360doc时复制，不弹出请登录提示）
// @author       QIQI
// @include      http://www.360doc.com/content/*
// @include      http://www.360doc.com/document/*
// @grant none
// @namespace https://greasyfork.org/users/16216
// @downloadURL https://update.greasyfork.org/scripts/39185/%E7%A0%B4%E8%A7%A3360doc%E9%98%B2%E5%A4%8D%E5%88%B6%E7%B3%BB%E7%BB%9Fzz.user.js
// @updateURL https://update.greasyfork.org/scripts/39185/%E7%A0%B4%E8%A7%A3360doc%E9%98%B2%E5%A4%8D%E5%88%B6%E7%B3%BB%E7%BB%9Fzz.meta.js
// ==/UserScript==

document.body.oncopy=null; //去掉当前设置的复制监听
document.body.__defineSetter__("oncopy",function(){}); //禁止修改复制监听