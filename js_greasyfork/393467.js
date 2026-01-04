// ==UserScript==
// @name         铁塔系统 小屏幕兼容
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  铁塔系统 小屏幕兼容 新增地址 请在 下方 match  中添加
// @author       You
// @match        http://180.153.49.130:9000/*
// @match        http://180.153.49.108:58080/*
// @match        http://180.153.49.216:9000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393467/%E9%93%81%E5%A1%94%E7%B3%BB%E7%BB%9F%20%E5%B0%8F%E5%B1%8F%E5%B9%95%E5%85%BC%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/393467/%E9%93%81%E5%A1%94%E7%B3%BB%E7%BB%9F%20%E5%B0%8F%E5%B1%8F%E5%B9%95%E5%85%BC%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style_html = 'form{overflow:auto;max-width: 100%;} form>div{max-width:100%;max-height:100%}';
        var style = document.createElement('style');
        style.type="text/css";
        style.appendChild(document.createTextNode(style_html));
        document.body.appendChild(style);
})();