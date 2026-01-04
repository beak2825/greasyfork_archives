// ==UserScript==
// @name         移除b站浏览器直播遮罩
// @version      0.3
// @description  移除bilibili守望先锋分区直播遮罩/马赛克
// @author       Overwatch Player
// @match        https://live.bilibili.com/*
// @grant        none
// @license       GPLv3
// @namespace https://greasyfork.org/users/1258643
// @downloadURL https://update.greasyfork.org/scripts/486852/%E7%A7%BB%E9%99%A4b%E7%AB%99%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9B%B4%E6%92%AD%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/486852/%E7%A7%BB%E9%99%A4b%E7%AB%99%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9B%B4%E6%92%AD%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsByClassName() {
        var elements = document.querySelectorAll('.web-player-module-area-mask');
        elements.forEach(function(element) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    window.addEventListener('load', function() {
        setTimeout(removeElementsByClassName, 600);
        setTimeout(removeElementsByClassName, 1000);
        setTimeout(removeElementsByClassName, 1500);
        setTimeout(removeElementsByClassName, 10000);
    });

    document.addEventListener('click', function() {
        setTimeout(removeElementsByClassName, 600);
        setTimeout(removeElementsByClassName, 1000);
        setTimeout(removeElementsByClassName, 1500);
        setTimeout(removeElementsByClassName, 10000);
    });
})();