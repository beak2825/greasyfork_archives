// ==UserScript==
// @name         Sweetwater Chinese Yuan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Sweetwater价格旁边显示人民币价格(仅供参考)
// @author       Yang
// @match        *://www.sweetwater.com/*
// @icon         https://www.google.com/s2/favicons?domain=sweetwater.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449695/Sweetwater%20Chinese%20Yuan.user.js
// @updateURL https://update.greasyfork.org/scripts/449695/Sweetwater%20Chinese%20Yuan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var priceGroupNode = document.getElementsByClassName('product-price--final')[0];
    var priceNode = priceGroupNode.getElementsByTagName('dollars')[0];
    var spanNode = document.createElement('span');
    spanNode.innerText = '(' + priceNode.innerText.replace(',','') * 6.5 + '元)';
    priceGroupNode.appendChild(spanNode);
})();