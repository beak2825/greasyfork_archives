// ==UserScript==
// @name         新标签打开网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在新标签打开网页
// @author       苏生不惑
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427794/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/427794/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("a").forEach(function(item,index,arr){item.target='_blank';});
})();