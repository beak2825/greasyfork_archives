// ==UserScript==
// @name         1101txtmg-ziqicheng
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  for txt encore concert ticket holder verification
// @author       xuyixin
// @match        https://fanevent.weverse.io/details/TOMORROW%20X%20TOGETHER
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513009/1101txtmg-ziqicheng.user.js
// @updateURL https://update.greasyfork.org/scripts/513009/1101txtmg-ziqicheng.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const firstName = document.querySelectorAll('dd.sc-ezredP.jueFfA')[0];
        const lastName = document.querySelectorAll('dd.sc-ezredP.jueFfA')[1];
        const membership = document.querySelectorAll('dd.sc-ezredP.jueFfA')[2];
        const email = document.querySelectorAll('address.sc-iwyWTf.kuPquQ')[0];
        firstName.innerText = "Ziqi";
        lastName.innerText = "Cheng";
        membership.innerText = "TM993729863";
        email.innerText = "jeongjagiczq@gmail.com";
    }, 2200);
})();