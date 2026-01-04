// ==UserScript==
// @name         水贴过滤
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       shiba
// @match        https://www.aliway.com/read.php?**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394849/%E6%B0%B4%E8%B4%B4%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/394849/%E6%B0%B4%E8%B4%B4%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelectorAll('.tpc_content').forEach(el => el.innerText.length < (10 + (el.innerText.includes('——发自') ? 15 : 0 )) && el.closest('div.t5').remove())

    // Your code here...
})();