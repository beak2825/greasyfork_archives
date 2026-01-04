// ==UserScript==
// @name         fuck wikiwiki.jp
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  干掉wikiwiki对非日本用户的弹窗验证
// @author       You
// @match        https://wikiwiki.jp/kancolle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389564/fuck%20wikiwikijp.user.js
// @updateURL https://update.greasyfork.org/scripts/389564/fuck%20wikiwikijp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.trolling-defence-check').unbind("click");
})();