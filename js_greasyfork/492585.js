// ==UserScript==
// @name         拦截Minecraft官网网易版的弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击适用中国大陆地区 IP 访问 Minecraft 官网弹出的网易版弹窗下的“继续浏览该网站”
// @author       信标bate
// @match        https://www.minecraft.net/*
// @grant        none
// @icon         https://zh.minecraft.wiki/images/Minecraft_franchise_icon.png
// @downloadURL https://update.greasyfork.org/scripts/492585/%E6%8B%A6%E6%88%AAMinecraft%E5%AE%98%E7%BD%91%E7%BD%91%E6%98%93%E7%89%88%E7%9A%84%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/492585/%E6%8B%A6%E6%88%AAMinecraft%E5%AE%98%E7%BD%91%E7%BD%91%E6%98%93%E7%89%88%E7%9A%84%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the popup to appear and then close it
    setTimeout(function() {
        var popupButton = document.querySelector('.MC_Button.MC_Button_Modal.MC_Glyph_Link_B.MC_Style_Core_Grey_1');
        if (popupButton) {
            popupButton.click(); // 点击按钮
        }
    }, 50); // 如果没有进行拦截可以尝试增加括号里的数字（单位是毫秒）
})();