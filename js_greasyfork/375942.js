// ==UserScript==
// @name         SouthPlus跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  SouthPlus等域名自动跳转
// @author       a8105
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://bbs.white-plus.net/*
// @match        *://www.white-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375942/SouthPlus%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375942/SouthPlus%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url=window.location.href;
    url=url.replace(window.location.host,"bbs.level-plus.net/");
    window.location.href=url;
})();