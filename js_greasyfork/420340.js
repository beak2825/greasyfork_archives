// ==UserScript==
// @name         Force Light Mode
// @namespace    https://marshallyin.com/
// @version      0.1
// @description  force light mode in site
// @author       You
// @match        https://marshallyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420340/Force%20Light%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/420340/Force%20Light%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('html').classList.remove('wp-dark-mode-active');
})();