// ==UserScript==
// @name         fucking bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get away from bilibili
// @author       cjh
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449809/fucking%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/449809/fucking%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = "https://www.google.com.hk/?hl=zh-cn";
    function gooutweb() {
    window.location.href = url;
    return;
    };
    function main() {
        console.log("main");
        gooutweb(); // main
    }
    if (true) main();
})();