// ==UserScript==
// @name         4245 - 洛谷强力学术
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Yt_4245
// @icon         https://cdn.luogu.com.cn/upload/usericon/1334245.png
// @description  tuifei breaker
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545975/4245%20-%20%E6%B4%9B%E8%B0%B7%E5%BC%BA%E5%8A%9B%E5%AD%A6%E6%9C%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/545975/4245%20-%20%E6%B4%9B%E8%B0%B7%E5%BC%BA%E5%8A%9B%E5%AD%A6%E6%9C%AF.meta.js
// ==/UserScript==

(function() {
'use strict';
const ALLOW_RULES = [
    /^https:\/\/(www\.)?luogu\.com\.cn\/?$/i,
    /^https:\/\/(www\.)?luogu\.com\.cn\/problem(\/list)?/i,
    /^https?:\/\/.*\.?deepseek\.com\/.*/i,
    /^https?:\/\/.*\.?doubao\.com\/.*/i,
    /^https:\/\/fanyi\.baidu\.com\/.*/i,
    /^https:\/\/www\.baidu\.com\/s\?.*wd=.*/i,
    /^https:\/\/(ai|chat|knowledge)\.baidu\.com\/.*/i
];

function shouldAllow() {
    const currentURL = window.location.href.toLowerCase();
    return ALLOW_RULES.some(regex => regex.test(currentURL));
}
if (!shouldAllow()) {
    console.warn('[学术模式] 拦截非学习网站:', window.location.href);
    window.location.replace('https://www.luogu.com.cn/problem/list');
}
})();
