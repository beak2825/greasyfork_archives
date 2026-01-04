// ==UserScript==
// @name         价值大师去除购买弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  价值大师去除购买弹窗,防止弹出挡住后面的数据
// @author       You
// @match        https://www.gurufocus.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gurufocus.cn
// @grant        GM_addStyle
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/459695/%E4%BB%B7%E5%80%BC%E5%A4%A7%E5%B8%88%E5%8E%BB%E9%99%A4%E8%B4%AD%E4%B9%B0%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/459695/%E4%BB%B7%E5%80%BC%E5%A4%A7%E5%B8%88%E5%8E%BB%E9%99%A4%E8%B4%AD%E4%B9%B0%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
(function() {
    'use strict';

    GM_addStyle("sticky-permission,paywall-overlay { display:none } .paywall-blur { filter: none;}");

    var targetNode = document.getElementById('q-app');
    window.removeAdByZmlu = function() {
        $(".sticky-permission").hide();
        $(".paywall-overlay").hide();
    };

    window.removeAdByZmlu();
    var config = { attributes: true, childList: true, subtree: true };
    var callback = function(mutationsList) {
        window.removeAdByZmlu();
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();