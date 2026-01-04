// ==UserScript==
// @name         javbus去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.javbus.com/*
// @include      https://www.javbus8.pw/*
// @include      /^https://www.javbus.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370673/javbus%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/370673/javbus%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.ad-list,.ad-table').remove();
   
})();