// ==UserScript==
// @name         Crowdin 域名重定向
// @namespace    https://greasyfork.org/users/1204387
// @version      0.1.0
// @description  将 Crowdin 的其他语言域名重定向至“zh.crowdin.com”。
// @author       Gentry Deng
// @match        http*://crowdin.com/*
// @match        http*://ar.crowdin.com/*
// @match        http*://be.crowdin.com/*
// @match        http*://br.crowdin.com/*
// @match        http*://cs.crowdin.com/*
// @match        http*://da.crowdin.com/*
// @match        http*://de.crowdin.com/*
// @match        http*://es.crowdin.com/*
// @match        http*://fr.crowdin.com/*
// @match        http*://hu.crowdin.com/*
// @match        http*://it.crowdin.com/*
// @match        http*://ja.crowdin.com/*
// @match        http*://pl.crowdin.com/*
// @match        http*://pt.crowdin.com/*
// @match        http*://ru.crowdin.com/*
// @match        http*://sk.crowdin.com/*
// @match        http*://tr.crowdin.com/*
// @match        http*://uk.crowdin.com/*
// @icon         https://crowdin.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495307/Crowdin%20%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/495307/Crowdin%20%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    if (location.hostname != "zh.crowdin.com") {
        window.location.hostname = "zh.crowdin.com";
    }
})();