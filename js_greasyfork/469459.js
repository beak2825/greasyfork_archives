// ==UserScript==
// @name         QQ打开链接自动跳转到真实连接
// @namespace    c.pc.qq.com
// @version      0.1
// @description  如果不能跳转，请自行修复，一般是正则问题
// @author       吾爱破解@夜泉
// @match        https://c.pc.qq.com/*
// @grant        none
// @license      吾爱破解@夜泉
// @downloadURL https://update.greasyfork.org/scripts/469459/QQ%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9C%9F%E5%AE%9E%E8%BF%9E%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/469459/QQ%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9C%9F%E5%AE%9E%E8%BF%9E%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentUrl = window.location.href;
    try{
        var match = /pfurl=(.*?)&pfuin/.exec(decodeURIComponent(currentUrl));
        if (match != null && match[1] !== undefined)  {
            window.location.href = match[1];
            return;
        }
       throw '正则没有匹配上，请修复';
    }catch(e){
        alert('报错了（油猴脚本名：QQ打开链接自动跳转到真实连接）\r\n\r\n' + e);
    }
})();
