// ==UserScript==
// @name         CSDN 自动跳转网页网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://link.csdn.net/?target=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423902/CSDN%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/423902/CSDN%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href=$("a.loading-btn").attr('href');
    // Your code here...
})();