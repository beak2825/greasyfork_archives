// ==UserScript==
// @name         yande.re去广告
// @namespace    http://tampermonkey.net/
// @version      2024-09-05
// @description  去掉yande.re占非常多尺寸的广告
// @author       某亚瑟
// @match        https://yande.re/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506983/yandere%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/506983/yandere%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('iframe {display:none}')
})();