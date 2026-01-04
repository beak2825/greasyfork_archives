// ==UserScript==
// @name         1101txtmembership-ziqicheng
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  txt membership holder page
// @author       xuyixin
// @match        https://shop.weverse.io/en/order/details/1741794249645882
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513010/1101txtmembership-ziqicheng.user.js
// @updateURL https://update.greasyfork.org/scripts/513010/1101txtmembership-ziqicheng.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const name = document.querySelectorAll('dd.sc-f6ff2ca9-3.dBjSPL')[0];
    const email = document.querySelectorAll('dd.sc-f6ff2ca9-3.dBjSPL')[1];
    const phone = document.querySelectorAll('dd.sc-f6ff2ca9-3.dBjSPL')[2];
    name.innerText = "Ziqi Cheng";
    email.innerText = "jeongjagiczq@gmail.com";
    phone.innerText = "+82 1080892530";
})();