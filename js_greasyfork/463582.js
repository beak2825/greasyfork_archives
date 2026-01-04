// ==UserScript==
// @name         discord 自動點箭頭by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  會自己點箭頭
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463582/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E7%AE%AD%E9%A0%ADby%20%E3%84%90%E3%84%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463582/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E7%AE%AD%E9%A0%ADby%20%E3%84%90%E3%84%90%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoClick() {
      var element = document.querySelector('.reactionInner-YJjOtT[aria-pressed="false"]:not([aria-label*="super react"])');
      if (element && element.getAttribute('aria-label').includes('arrow')) {
        element.click();
        console.log("done");
      }
    }

setInterval(autoClick, 1000);
})();