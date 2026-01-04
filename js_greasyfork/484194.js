// ==UserScript==
// @name         Hide-OA-Watermarks
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Masking Panavision OA Watermark
// @author       evi1ox
// @match        http://10.25.120.177:8787/*
// @match        http://218.94.133.210:9000/*
// @match        http://eoa.elextec.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484194/Hide-OA-Watermarks.user.js
// @updateURL https://update.greasyfork.org/scripts/484194/Hide-OA-Watermarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var intervalId = setInterval(removeWatermarks, 2000);

    function removeWatermarks() {
        var watermarks1 = document.querySelectorAll('img[id^="wea_watermark_"]');
        watermarks1.forEach(function(watermark) {
            watermark.remove();
        });
        var watermarks2 = document.querySelectorAll('#wf_watremark');
        watermarks2.forEach(function(watermark) {
            watermark.remove();
        });
        var watermarks3 = document.querySelectorAll('#wf_watremark_wrap');
        watermarks3.forEach(function(watermark) {
            watermark.remove();
        });
    }
})();