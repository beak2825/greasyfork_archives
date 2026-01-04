// ==UserScript==
// @name         Kill Baidu Search hotspot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Apocal
// @match        *://*.baidu.com/*
// @grant        unsafeWindow
// @grant        GM_log
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394788/Kill%20Baidu%20Search%20hotspot.user.js
// @updateURL https://update.greasyfork.org/scripts/394788/Kill%20Baidu%20Search%20hotspot.meta.js
// ==/UserScript==

var $ = window.jQuery;
$("body").on('DOMSubtreeModified', function() {
    GM_log("changed");
    $(".FYB_RD, .FYB_BD, .ad-block").hide();
    $(".lemmaWgt-promotion-slide, .lemmaWgt-promotion-vbaike, .unionAd").hide();
});