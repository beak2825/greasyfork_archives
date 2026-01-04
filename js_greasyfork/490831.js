// ==UserScript==
// @name         Zh Minecraft Wiki Fxxking Famdom
// @version      2024-3-25
// @description  Redirects from minecraft.famdom.com to zh.minecraft.wiki
// @namespace    https://greasyfork.org/zh-CN/users/1269309-oldkingok
// @match        *minecraft.fandom.com/*
// @grant        none
// @run-at       document-start
// @icon         https://zh.minecraft.wiki/images/Wiki@2x.png
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/490831/Zh%20Minecraft%20Wiki%20Fxxking%20Famdom.user.js
// @updateURL https://update.greasyfork.org/scripts/490831/Zh%20Minecraft%20Wiki%20Fxxking%20Famdom.meta.js
// ==/UserScript==
var fandomUrl = 'minecraft.fandom.com'
var replaced = 'minecraft.fandom.com/zh/wiki'
var replacement = 'zh.minecraft.wiki'
if (fandomUrl == location.hostname)
{
    window.stop();
    var url = new URL(location.href.replace(replaced, replacement));
    location.assign(url.href);
}