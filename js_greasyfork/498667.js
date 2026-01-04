// ==UserScript==
// @name         移除 Minecraft.net 网易弹窗
// @license      MIT
// @version     1.0
// @description  Skip netease popup.
// @author       Cinder
// @match        http://*.minecraft.net/*
// @match        https://*.minecraft.net/*
// @namespace https://greasyfork.org/users/1281916
// @downloadURL https://update.greasyfork.org/scripts/498667/%E7%A7%BB%E9%99%A4%20Minecraftnet%20%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/498667/%E7%A7%BB%E9%99%A4%20Minecraftnet%20%E7%BD%91%E6%98%93%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        document.querySelector('button.MC_modal_close[data-aem-contentname="close-icon"]').click();
    };
    document.getElementById('popup-btn').click();
})();