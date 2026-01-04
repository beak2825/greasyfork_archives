// ==UserScript==
// @name         战胜阴间网页模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script is used to remove the unfavorable color style in your web page.Working quite well on ZhiHu,but i'm not sure about whether it can work on other web pages.
// @author       Gai
// @match        https://*/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456035/%E6%88%98%E8%83%9C%E9%98%B4%E9%97%B4%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/456035/%E6%88%98%E8%83%9C%E9%98%B4%E9%97%B4%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //console.log(htm.className);
    //console.log(htm.className);
    var func = function() {
        switch (window.location.host) {
            case "www.bilibili.com":
                var list = document.getElementsByClassName('gray');
                if (list) {
                    var htm = list[0];
                }
                if (htm) {

                    htm.className = '';
                }
                break;
            case "www.zhihu.com":

                var list2 = document.getElementsByClassName('itcauecng');
                if (list2) {
                    var htm2 = list2[0];
                }
                if (htm2) {

                    htm2.className = 'wudqvirup-ilowhu';
                }
        }

    }
    window.setInterval(func, 100);
})();