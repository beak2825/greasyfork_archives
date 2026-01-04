// ==UserScript==
// @name         DPlayer脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Help adjust dplayer params ...
// @author       Xiangman
// @match        https://gv377.xyz/*
// @match        https://*.gv377.xyz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434816/DPlayer%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434816/DPlayer%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    dp.volume(0.0);
    dp.speed(16.0);
})();