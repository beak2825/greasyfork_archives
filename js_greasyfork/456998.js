// ==UserScript==
// @name         youtube unround corners
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  i don't like how youtube rounds everything. This script just makes all rounded corners disappear.
// @author       You
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456998/youtube%20unround%20corners.user.js
// @updateURL https://update.greasyfork.org/scripts/456998/youtube%20unround%20corners.meta.js
// ==/UserScript==

(function() {
    'use strict';
var style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule('* {border-radius: 0px !important;}');
})();