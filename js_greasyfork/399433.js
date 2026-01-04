// ==UserScript==
// @name         沉痛的哀悼
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rip
// @author       You
// @include     http*://*2dkf.com/*
// @include     http*://*9moe.com/*
// @include     http*://*kfgal.com/*
// @include     https://*miaola.info/*
// @include     *bbs.ikfol.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399433/%E6%B2%89%E7%97%9B%E7%9A%84%E5%93%80%E6%82%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/399433/%E6%B2%89%E7%97%9B%E7%9A%84%E5%93%80%E6%82%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
var gary_str ="html {-webkit-filter: grayscale(0.95); }"
var new_element = document.createElement("style");
new_element.innerHTML =(gary_str);
document.head.appendChild(new_element);
    // Your code here...
})();