// ==UserScript==
// @name         Captcha Workers Helper
// @namespace    https://www.facebook.com/groups/captchaworkersgroup/
// @version      1.01
// @description  Refresca el blog.
// @author       Zizzou
// @noframes
// @match        https://zizzoukolo.blogspot.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389458/Captcha%20Workers%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/389458/Captcha%20Workers%20Helper.meta.js
// ==/UserScript==

window.onload = function() {
        setTimeout(function () {
            location.reload(true)
        }, 12000);
     };