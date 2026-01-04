// ==UserScript==
// @name         creativecow.net 自动跳转
// @namespace    http://www.medicaldupeng.com/
// @version      0.1
// @description  creativecow.net 自动跳转!
// @author       medicaldupeng
// @match        https://wwwm.creativecow.net/interstitial.php?url=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391244/creativecownet%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/391244/creativecownet%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    location.href = document.querySelector('a').href;
    // Your code here...
})();