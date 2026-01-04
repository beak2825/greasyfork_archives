// ==UserScript==
// @name         No more bind phone
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  remove the bind phone number model
// @author       Tuhacrt
// @match        https://juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523620/No%20more%20bind%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/523620/No%20more%20bind%20phone.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer = null;

    function removeBindPhoneModalBox() {
        document.querySelector('.bind-phone-number-modal-box')?.remove();
    }

    function makeBodyScrollable() {
        document.body.style.overflow = 'auto';
    }

    function trigger() {
        removeBindPhoneModalBox();
        makeBodyScrollable();
        clearInterval(timer);
    }

    timer = setInterval(trigger, 1000);
})();
