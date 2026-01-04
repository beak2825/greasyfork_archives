// ==UserScript==
// @name         阿米加净化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  眼不见为净
// @author       Nihaorz
// @match        *://ame.geostar.com.cn:8096/*
// @icon         https://ame.geostar.com.cn:8096/default/ame/clipview/assets/images/title_logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473869/%E9%98%BF%E7%B1%B3%E5%8A%A0%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/473869/%E9%98%BF%E7%B1%B3%E5%8A%A0%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#windowContent .col-sm-6:eq(0)").remove();
    $("#windowContent .col-sm-6:eq(1)").insertBefore($("#windowContent .col-sm-6:eq(3)"));
})();