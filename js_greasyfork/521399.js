// ==UserScript==
// @name         Stop Old Reddit asking to login
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.2
// @description  Remove the login fields from Old Reddit
// @match        https://old.reddit.com/*
// @match        https://np.reddit.com/*
// @run-at       document-start
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/521399/Stop%20Old%20Reddit%20asking%20to%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/521399/Stop%20Old%20Reddit%20asking%20to%20login.meta.js
// ==/UserScript==

(function() {
  'use strict';
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.listingsignupbar, #login_login-main, .user, #header-bottom-right > .separator, .title.selected, .toggle.subscribe-button.fancy-toggle-button { display: none !important; }';
})();