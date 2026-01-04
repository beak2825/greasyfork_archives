// ==UserScript==
// @name         discord 自動點睡睡臉by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  會自己點睡睡臉
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463583/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E7%9D%A1%E7%9D%A1%E8%87%89by%20%E3%84%90%E3%84%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463583/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E7%9D%A1%E7%9D%A1%E8%87%89by%20%E3%84%90%E3%84%90%E4%BA%BA.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function autoClick() {
      var element = document.querySelector('.reactionInner-YJjOtT[aria-pressed="false"]');
      if (element && element.getAttribute('aria-label').includes('sleeper')) {
        element.click();
        console.log("done");
      }
    }
 
setInterval(autoClick, 1000);
})();