// ==UserScript==
// @name         QQ非官方页面自动跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/438306/
// @version      1.1
// @description  打开一个非官方页面后自动跳转
// @match        https://c.pc.qq.com/*
// @icon         https://s2.loli.net/2024/02/16/4f9MjHF2yg6Ueor.jpg
// @author       Rylleon
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/487417/QQ%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487417/QQ%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function getUrlParam(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

(function() {
    'use strict';
    window.location.href = getUrlParam('pfurl')
})();