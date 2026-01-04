// ==UserScript==
// @name         定时刷新
// @namespace    http://tampermonkey.net/
// @version      0.5   
// @description  定时刷新脚本
// @author       hiszm
// @match        *://*/*
// @grant        none
// @compatible   chrome
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/419247/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/419247/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function () {
'use strict';

setTimeout(function(){location.reload();}, 1000);


})();
