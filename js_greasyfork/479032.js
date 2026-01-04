// ==UserScript==
// @name         自动删除乐魔ui的登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Remove the login popup from the webpage
// @author       Rebix
// @match        https://www.lemooui.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479032/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%B9%90%E9%AD%94ui%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/479032/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%B9%90%E9%AD%94ui%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the parent element that contains the login popup
    var loginPopup = document.querySelector('div.ui-pop-up-layer-login.none');

    // Check if the login popup exists
    if (loginPopup) {
        // Remove the login popup element
        loginPopup.parentNode.removeChild(loginPopup);
    }
})();