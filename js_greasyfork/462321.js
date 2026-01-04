// ==UserScript==
// @name         Remove Bilibili Live Gift Panel
// @namespace    ACGMN
// @version      0.1.2
// @description  Remove gift panel from bilibili live page 去除b站直播间礼物面板
// @author       ACGMN
// @license      MIT
// @match        *://live.bilibili.com/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://live.bilibili.com&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462321/Remove%20Bilibili%20Live%20Gift%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/462321/Remove%20Bilibili%20Live%20Gift%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function () {
        if(document.querySelector('#web-player__bottom-bar__container')){
            document.querySelector('#web-player__bottom-bar__container').remove()
        }
        if(document.querySelector('#gift-control-vm')){
            document.querySelector('#gift-control-vm').remove()
        }
    }, 1000)
})();
