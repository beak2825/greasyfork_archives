// ==UserScript==
// @name         [直播用]将HLTV台湾地区旗帜替换为中国国旗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将HLTV台湾地区旗帜替换为中国国旗，规避审核
// @author       cirno
// @match        https://www.hltv.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530977/%5B%E7%9B%B4%E6%92%AD%E7%94%A8%5D%E5%B0%86HLTV%E5%8F%B0%E6%B9%BE%E5%9C%B0%E5%8C%BA%E6%97%97%E5%B8%9C%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E5%9B%BD%E5%9B%BD%E6%97%97.user.js
// @updateURL https://update.greasyfork.org/scripts/530977/%5B%E7%9B%B4%E6%92%AD%E7%94%A8%5D%E5%B0%86HLTV%E5%8F%B0%E6%B9%BE%E5%9C%B0%E5%8C%BA%E6%97%97%E5%B8%9C%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E5%9B%BD%E5%9B%BD%E6%97%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceFlags() {
        document.querySelectorAll('img[src*="/flags/30x20/TW.gif"]').forEach(img => {
            img.src = "https://www.hltv.org/img/static/flags/30x20/CN.gif";
        });
    }

    // Initial replacement
    replaceFlags();

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver(replaceFlags);
    observer.observe(document.body, { childList: true, subtree: true });
})();