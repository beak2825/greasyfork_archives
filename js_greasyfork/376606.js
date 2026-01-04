// ==UserScript==
// @name         51cto 关闭全屏广告
// @namespace    http://les1ie.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://blog.51cto.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376606/51cto%20%E5%85%B3%E9%97%AD%E5%85%A8%E5%B1%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/376606/51cto%20%E5%85%B3%E9%97%AD%E5%85%A8%E5%B1%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("start...");
    $(".closeMB").click();
    console.log("end");
})();