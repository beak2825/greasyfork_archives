// ==UserScript==
// @name         去除B站直播PK
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除烦人的哔哩哔哩直播pk条
// @description  try to take over the world!
// @author       You
// @match        https://live.bilibili.com/*
// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387727/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%ADPK.user.js
// @updateURL https://update.greasyfork.org/scripts/387727/%E5%8E%BB%E9%99%A4B%E7%AB%99%E7%9B%B4%E6%92%ADPK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.getElementById("chaos-pk-vm");
    div.parentNode.removeChild(div);
    $('.main').trigger("click");
    $('.icon-font.icon-close').trigger("click");
})();