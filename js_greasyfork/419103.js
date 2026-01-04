// ==UserScript==
// @name         github新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.github.com/*
// @match        https://*.gitee.com/*
// @match        https://*.greasyfork.org/*
// @require    http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419103/github%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/419103/github%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(function () {
    $("a").each(function () {
        $(this).attr("target","_blank");
    })
})
    // Your code here...
})();