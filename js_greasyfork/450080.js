// ==UserScript==
// @name         自动留在Minecraft.net
// @license       GPL3.0
// @version      1
// @description  minecraft官网自动点击 留在Minecraft.net 按钮
// @author       GentsunCheng
// @match        http://*.minecraft.net/*
// @match        https://*.minecraft.net/*
// @icon         https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/521996
// @downloadURL https://update.greasyfork.org/scripts/450080/%E8%87%AA%E5%8A%A8%E7%95%99%E5%9C%A8Minecraftnet.user.js
// @updateURL https://update.greasyfork.org/scripts/450080/%E8%87%AA%E5%8A%A8%E7%95%99%E5%9C%A8Minecraftnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn=document.querySelector('#popup-btn.btn.btn-link');
    btn.click();
})();