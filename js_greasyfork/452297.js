// ==UserScript==
// @name         关闭 Minecraft 官网弹出提示
// @namespace    http://muyangplus.github.io
// @version      0.1
// @description  关闭中国地区 Minecraft 官网弹出的提示信息。
// @author       muyangplus
// @match        https://www.minecraft.net/*
// @icon         https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452297/%E5%85%B3%E9%97%AD%20Minecraft%20%E5%AE%98%E7%BD%91%E5%BC%B9%E5%87%BA%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/452297/%E5%85%B3%E9%97%AD%20Minecraft%20%E5%AE%98%E7%BD%91%E5%BC%B9%E5%87%BA%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("popup-btn").click();
})();
