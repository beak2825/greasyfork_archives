// ==UserScript==
// @name         bilibili adblock tips hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏bilibili恶心的adblock牛皮藓提示！
// @license MIT
// @match      *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467880/bilibili%20adblock%20tips%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/467880/bilibili%20adblock%20tips%20hide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#i_cecream > div.adblock-tips").remove()
})();