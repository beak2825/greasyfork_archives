// ==UserScript==
// @name         bjt paste
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  Set arxiv.org/html to light default.
// @author       evanlin
// @match        https://portal.bjt.beijing.gov.cn/*
// @icon         https://portal.bjt.beijing.gov.cn/p/assets/imgs/newIcon3.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501738/bjt%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/501738/bjt%20paste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        setTimeout(function() {
            document.getElementById('account-login-icon').click();
            document.getElementById('password').setAttribute('type', 'password');
            document.getElementById('password').removeAttribute('onpaste');
        }, 500);
    };
})();