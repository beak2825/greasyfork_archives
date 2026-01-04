// ==UserScript==
// @name         破除CSDN、知乎等安全中心跳转
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Modify some titles, like csdn and zhihu ...
// @author       Xiangman
// @match        https://link.csdn.net/*
// @match        https://*.link.csdn.net/*
// @match        https://link.zhihu.com/*
// @match        https://*.link.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447499/%E7%A0%B4%E9%99%A4CSDN%E3%80%81%E7%9F%A5%E4%B9%8E%E7%AD%89%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/447499/%E7%A0%B4%E9%99%A4CSDN%E3%80%81%E7%9F%A5%E4%B9%8E%E7%AD%89%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title = window.location.href;
    // alert(title);
    if (title.indexOf("/?target=") != -1) {
        var start = title.indexOf("=") + 1;
        title = title.substring(start);
        while (title.indexOf("%") != -1) {
            start = title.indexOf("%");
            var tmp = title.substring(start, start+3);
            var tmpa = tmp.replace("%", "0x");
            var resa = String.fromCharCode(tmpa);
            while (title.indexOf(tmp) != -1) {
                title = title.replace(tmp, resa);
            }
        }
        // alert(title);
        window.location.replace(title)
    }
})();