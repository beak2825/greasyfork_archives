// ==UserScript==
// @name         天天电影网去除弹窗广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       香香的牛粪
// @match        http://www.27k.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395756/%E5%A4%A9%E5%A4%A9%E7%94%B5%E5%BD%B1%E7%BD%91%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/395756/%E5%A4%A9%E5%A4%A9%E7%94%B5%E5%BD%B1%E7%BD%91%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var dd = document.getElementsByClassName("bd");
    dd[0].remove();
})();