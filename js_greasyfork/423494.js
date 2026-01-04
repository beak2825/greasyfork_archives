// ==UserScript==
// @name         禁止弹窗、弹框
// @namespace    http://ccvxx.cn/
// @version      0.1
// @description  禁止alert弹窗
// @author       涼城
// @match             *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423494/%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97%E3%80%81%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/423494/%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97%E3%80%81%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.alert = function() {
    return false;
}

    // Your code here...
})();