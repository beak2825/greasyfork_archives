// ==UserScript==
// @name         沪江小D词典去除门帘广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @grant        none
// @include     https://dict.hjenglish.com/*
// @downloadURL https://update.greasyfork.org/scripts/389347/%E6%B2%AA%E6%B1%9F%E5%B0%8FD%E8%AF%8D%E5%85%B8%E5%8E%BB%E9%99%A4%E9%97%A8%E5%B8%98%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/389347/%E6%B2%AA%E6%B1%9F%E5%B0%8FD%E8%AF%8D%E5%85%B8%E5%8E%BB%E9%99%A4%E9%97%A8%E5%B8%98%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
 setTimeout(function () {
     var adSidebar = document.getElementById('_drawcurtain_114_0');
     if (adSidebar) {
         adSidebar.parentNode.removeChild(adSidebar);
     }
 }, 500)

})();