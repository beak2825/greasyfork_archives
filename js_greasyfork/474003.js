// ==UserScript==
// @name         关闭多端检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭多端检测11
// @author       haifennj
// @match        https://www.cmechina.net/cme/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmechina.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474003/%E5%85%B3%E9%97%AD%E5%A4%9A%E7%AB%AF%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474003/%E5%85%B3%E9%97%AD%E5%A4%9A%E7%AB%AF%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        window.ajaxstatus = function() {};
    }, 1);
})();