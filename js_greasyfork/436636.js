// ==UserScript==
// @name         bilibili 解锁 HEVC + 8k
// @namespace    mscststs
// @version      0.3
// @license MIT
// @description  为 B站 Windows 平台解锁 8k HEVC
// @author       mscststs
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @run-at      document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436636/bilibili%20%E8%A7%A3%E9%94%81%20HEVC%20%2B%208k.user.js
// @updateURL https://update.greasyfork.org/scripts/436636/bilibili%20%E8%A7%A3%E9%94%81%20HEVC%20%2B%208k.meta.js
// ==/UserScript==

(function() {
    window.localStorage['bilibili_player_force_8k'] = 1;
    'use strict';
    try{
    Object.defineProperty(navigator, 'userAgent', {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/605.1.15"
    });
    }catch(e){
    }

})();