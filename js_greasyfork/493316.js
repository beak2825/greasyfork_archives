// ==UserScript==
// @name         allow-translate
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  允许谷歌浏览器对temu站点进行翻译
// @author       Deyu
// @include      https://www.temu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493316/allow-translate.user.js
// @updateURL https://update.greasyfork.org/scripts/493316/allow-translate.meta.js
// ==/UserScript==

(function() {
    document.documentElement.setAttribute("translate", "")
})();