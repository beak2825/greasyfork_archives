// ==UserScript==
// @name         屏蔽IT之家AdBlock提示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  隐藏ADBlock banner
// @author       isaac young
// @match        https://*.ithome.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/370231/%E5%B1%8F%E8%94%BDIT%E4%B9%8B%E5%AE%B6AdBlock%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/370231/%E5%B1%8F%E8%94%BDIT%E4%B9%8B%E5%AE%B6AdBlock%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = document.createElement('style');
    s.innerHTML = '.AdblockBanner {display: none!important;}';
    document.querySelector('head').appendChild(s);
    // Your code here...
})();