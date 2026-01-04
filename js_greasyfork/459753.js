// ==UserScript==
// @name         修复Minecraft官网（minecraft.net）一些页面下无法滚动
// @namespace    https://fuckmodalopen.minecraft.net
// @version      1.0
// @description  修复Minecraft官网（minecraft.net）一些页面下页面无法滚动
// @author       Aixiaoji
// @match        https://www.minecraft.net/*
// @icon         https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-60x60.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459753/%E4%BF%AE%E5%A4%8DMinecraft%E5%AE%98%E7%BD%91%EF%BC%88minecraftnet%EF%BC%89%E4%B8%80%E4%BA%9B%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%97%A0%E6%B3%95%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459753/%E4%BF%AE%E5%A4%8DMinecraft%E5%AE%98%E7%BD%91%EF%BC%88minecraftnet%EF%BC%89%E4%B8%80%E4%BA%9B%E9%A1%B5%E9%9D%A2%E4%B8%8B%E6%97%A0%E6%B3%95%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

// 删除body标签，class 属性中的modal-open
(function() {
    jQuery("body").removeClass("modal-open");
})();