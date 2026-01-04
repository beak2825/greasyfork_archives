// ==UserScript==
// @name         JumpToNewMinecraftWiki
// @author       萌萌哒丶九灬书
// @description  J2n_MC_wiki - 新·我的世界中文wiki跳转|刷新界面|重定向Fandom的url
// @namespace    https://space.bilibili.com/1501743
// @license      GNU General Public License v3.0
// @version      0.0.3
// @create       2023-11-11
// @lastmodified 2023-11-12
// @include      /^https?:\/\/zh\.minecraftwiki\.net/
// @include      /^https?:\/\/minecraft\-zh\.gamepedia\.com/
// @include      /^https?:\/\/minecraft\.fandom\.com/
// @mainpage     https://greasyfork.org/zh-CN/scripts/479549/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479549/JumpToNewMinecraftWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/479549/JumpToNewMinecraftWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (window.location.pathname.substr(0,3)=='/zh')?((window.location.pathname.substr(8)=='/Minecraft_Wiki')?(window.location.replace(`https://zh.minecraft.wiki/`)):(window.location.replace(`https://zh.minecraft.wiki/w${window.location.pathname.substr(8)}/`))):((window.location.pathname.substr(5)=='/Minecraft_Wiki')?(window.location.replace(`https://minecraft.wiki/`)):(window.location.replace(`https://minecraft.wiki/w${window.location.pathname.substr(5)}/`)));
})();