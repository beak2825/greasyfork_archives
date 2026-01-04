// ==UserScript==
// @name         幫你按一下LINE登入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  幫你按一下LINE登入0613
// @author       forthdog
// @match        https://access.line.me/oauth2/v2.1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=line.me
// @grant        none
// @license      mine

// @downloadURL https://update.greasyfork.org/scripts/468530/%E5%B9%AB%E4%BD%A0%E6%8C%89%E4%B8%80%E4%B8%8BLINE%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/468530/%E5%B9%AB%E4%BD%A0%E6%8C%89%E4%B8%80%E4%B8%8BLINE%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const b = document.querySelector('div.login-button > button');
    if (b) {
        b.click();
    }
})();