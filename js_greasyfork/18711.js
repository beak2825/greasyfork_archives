// ==UserScript==
// @name         Anti-AdBlock killer for cnBeta
// @namespace    http://leedy.me/
// @version      0.3
// @description  移除 cnBeta 的恼人弹窗
// @author       Leedy
// @match        http://www.cnbeta.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18711/Anti-AdBlock%20killer%20for%20cnBeta.user.js
// @updateURL https://update.greasyfork.org/scripts/18711/Anti-AdBlock%20killer%20for%20cnBeta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.$) $('.mask-close').parent().parent().remove();
})();