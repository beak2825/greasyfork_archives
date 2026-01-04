// ==UserScript==
// @name         Minecraft官网弹窗拦截
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拦截使用中国大陆IP地址时访问Minecraft官网弹出的中国版推广弹窗
// @author       信标bate
// @match        https://www.minecraft.net/*
// @grant        none
// @icon         https://zh.minecraft.wiki/images/Minecraft_franchise_icon.png
// @downloadURL https://update.greasyfork.org/scripts/499059/Minecraft%E5%AE%98%E7%BD%91%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/499059/Minecraft%E5%AE%98%E7%BD%91%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the popup to appear and then close it
    setTimeout(function() {
        var popupButton = document.querySelector('.MC_Button.MC_Button_Modal.MC_Glyph_Link_B.MC_Style_Core_Grey_1');
        if (popupButton) {
            popupButton.click();
        }
    }, 50); // 如拦截失败可尝试将左侧数字增加(默认50)
})();