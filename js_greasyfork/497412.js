// ==UserScript==
// @name         South Star
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  South+ 链接修复，域名跳转
// @license MIT
// @author       zaypen
// @match        *://*.blue-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.east-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://www.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=spring-plus.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497412/South%20Star.user.js
// @updateURL https://update.greasyfork.org/scripts/497412/South%20Star.meta.js
// ==/UserScript==

var target = 'south-plus.net';
var keywords = ['white-plus', 'level-plus', 'spring-plus', 'summer-plus', 'north-plus', 'south-plus', 'east-plus', 'snow-plus', 'imoutolove.me', 'blue-plus'];
var patterns = keywords.map(k => `(?:(www|bbs)\.)?${k}(?:\.(net|org))?`);

(function() {
    'use strict';
    Array.apply(null, document.getElementsByTagName('a')).forEach(function (a) {
        patterns.forEach(function (pattern) {
            a.href = a.href.replace(pattern, target);
        });
    });
    if (location.hostname !== target && patterns.some(p => location.hostname.match(p))) {
        location.replace(location.href.replace(location.hostname, target));
    }
})();