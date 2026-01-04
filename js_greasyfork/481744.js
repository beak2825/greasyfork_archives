// ==UserScript==
// @name         Bangumi隐藏评分排名
// @namespace    https://zeng.games/
// @version      0.2.0
// @description  隐藏评分，让你不摆脱他人的成见，带着新鲜的心情观看每个作品，保持自己独特的口味。
// @author       JiaChen ZENG
// @match        https://bgm.tv/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481744/Bangumi%E9%9A%90%E8%97%8F%E8%AF%84%E5%88%86%E6%8E%92%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/481744/Bangumi%E9%9A%90%E8%97%8F%E8%AF%84%E5%88%86%E6%8E%92%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Search page
    GM_addStyle('.rateInfo { filter: blur(10px); transition: filter 0.3s; }');
    GM_addStyle('.rank { filter: blur(5px); transition: filter 0.3s; }');
    GM_addStyle('.rateInfo:hover, .rank:hover { filter: none; }');

    // Subject page
    GM_addStyle('[rel="v:rating"] { filter: blur(30px); transition: filter 0.3s; }');
    GM_addStyle('[rel="v:rating"]:hover { filter: none; }');
})();