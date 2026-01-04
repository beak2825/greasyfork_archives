// ==UserScript==
// @name         aitok默认隐私
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  aitok默认隐私，保护每一个人
// @author       hevily
// @match        https://chat.aitok.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aitok.ai
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479902/aitok%E9%BB%98%E8%AE%A4%E9%9A%90%E7%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/479902/aitok%E9%BB%98%E8%AE%A4%E9%9A%90%E7%A7%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){
document.querySelector('button[title*="将对话设置为私密"]').click();
},1500)
   
})();