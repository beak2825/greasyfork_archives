// ==UserScript==
// @name         click
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  高亮并复制脚本
// @author       Tequila
// @match        http://risk.baidu.com/mark/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392688/click.user.js
// @updateURL https://update.greasyfork.org/scripts/392688/click.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var ran = function GetRandomNum() {
        var Rand = Math.random();
        return (1.5 + Rand);
    };
    setInterval(() => {
        $('.quality-btn.btn-ope.btn-pass').click()
    }, ran() * 1000);
})();