// ==UserScript==
// @name         屏蔽zzzfun的天龙人城市ip检测
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  搜狐那个ip城市检测挺怪的 无论你在哪儿 都可能会被判定到你在上海市人民政府旅游
// @author       ALINGCAT
// @match        *://www.zzzfun.com/*
// @icon         blob:chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/6791b093-3469-4697-b6aa-c16f59e29585
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456097/%E5%B1%8F%E8%94%BDzzzfun%E7%9A%84%E5%A4%A9%E9%BE%99%E4%BA%BA%E5%9F%8E%E5%B8%82ip%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456097/%E5%B1%8F%E8%94%BDzzzfun%E7%9A%84%E5%A4%A9%E9%BE%99%E4%BA%BA%E5%9F%8E%E5%B8%82ip%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    returnCitySN = undefined;
})();