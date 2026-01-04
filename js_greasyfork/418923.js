// ==UserScript==
// @name         煎蛋去侧边栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       GaryXiong
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @match        http://jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418923/%E7%85%8E%E8%9B%8B%E5%8E%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/418923/%E7%85%8E%E8%9B%8B%E5%8E%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#sidebar").remove();
    $("#content").css("width","100%")
})();