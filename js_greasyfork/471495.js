// ==UserScript==
// @name         Adfoc 自动显示跳过按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load and remove Adfoc hidden skip button
// @author       LingQi
// @match        https://adfoc.us/serve/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfoc.us
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471495/Adfoc%20%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E8%B7%B3%E8%BF%87%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/471495/Adfoc%20%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E8%B7%B3%E8%BF%87%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let skinDiv = document.querySelector("#showSkip");
    skinDiv.removeAttribute("style");
    // Your code here...
})();