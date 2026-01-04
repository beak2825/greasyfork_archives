// ==UserScript==
// @name         爱奇艺视频去Logo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除爱奇艺视频的非内嵌水印
// @icon         https://www.iqiyipic.com/common/fix/128-128-logo.png
// @author       JellyBeanXiewh
// @match        http*://www.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420125/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E5%8E%BBLogo.user.js
// @updateURL https://update.greasyfork.org/scripts/420125/%E7%88%B1%E5%A5%87%E8%89%BA%E8%A7%86%E9%A2%91%E5%8E%BBLogo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        document.getElementsByClassName("iqp-logo-box")
            .forEach(function(item, index, arr) {
                item.remove();
            });
    }, 2000);
})();