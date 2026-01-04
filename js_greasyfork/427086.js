// ==UserScript==
// @name         ygo-sem屏蔽广告检测
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A simple script to skip adblocked note.
// @author cjh
// @include      *://www.ygo-sem.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427086/ygo-sem%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427086/ygo-sem%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
                $("#addesc").fadeOut(600, function() {
                    $("#idadkillsho").remove();
                });
            }, 100);
})();