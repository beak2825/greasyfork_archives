// ==UserScript==
// @name         ESP辅助脚本2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ESP辅助脚本
// @author       twt
// @match        https://esplmc-test.apps.digiwincloud.com.cn/esp-log/LogViewer.do*
// @match        https://esplmc.apps.digiwincloud.com.cn/esp-log/LogViewer.do*
// @match        https://esplmc.apps.digiwincloud.com/esp-log/LogViewer.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digiwincloud.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483361/ESP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC2.user.js
// @updateURL https://update.greasyfork.org/scripts/483361/ESP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }



    window.onload = function(){
        // 获取JSESSIONID字段的值
        var jsessionId = getCookie("JSESSIONID");
        if (jsessionId) {
            setCookie('JSESSIONID', jsessionId, 30);
        }
    };

})();