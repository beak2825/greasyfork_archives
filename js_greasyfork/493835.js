// ==UserScript==
// @name         bilibili-improver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除b站马赛克
// @author       Justin
// @match        https://live.bilibili.com/7777*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493835/bilibili-improver.user.js
// @updateURL https://update.greasyfork.org/scripts/493835/bilibili-improver.meta.js
// ==/UserScript==
(function() {
    'use strict'
    setTimeout(() => {
        document.getElementsByClassName("web-player-module-area-mask")[0].remove()
    }, 1300)
})();