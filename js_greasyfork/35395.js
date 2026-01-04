// ==UserScript==
// @name         手机查看网页源码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.msn.com/spartan/ntp?locale=zh-Hans-CN&market=CN&enableregulatorypsm=0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35395/%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%E7%BD%91%E9%A1%B5%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/35395/%E6%89%8B%E6%9C%BA%E6%9F%A5%E7%9C%8B%E7%BD%91%E9%A1%B5%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.open('view-source:'+window.location.href);
    // Your code here...
})();