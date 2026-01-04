// ==UserScript==
// @name         灵动游戏免登录
// @namespace    http://tampermonkey.net/
// @version      2024-01-30
// @description  灵动游戏屏蔽登录遮挡
// @author       zxm
// @match        https://www.mhhf.com/game/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mhhf.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444853/%E7%81%B5%E5%8A%A8%E6%B8%B8%E6%88%8F%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444853/%E7%81%B5%E5%8A%A8%E6%B8%B8%E6%88%8F%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("#authtips").remove();
    document.querySelector("#idialogshadow").remove();
})();