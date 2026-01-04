// ==UserScript==
// @name         Fonbet → API‐unblocker Redirect (full generic v1.4)
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  Přesměruje všechny URL /live/.../<číslo> a /sports/.../<číslo> (s nebo bez trailing slash) na api-unblocker…/fonbet/ID
// @match        https://fonbet.com.cy/*
// @author       Lukáš Malec
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540509/Fonbet%20%E2%86%92%20API%E2%80%90unblocker%20Redirect%20%28full%20generic%20v14%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540509/Fonbet%20%E2%86%92%20API%E2%80%90unblocker%20Redirect%20%28full%20generic%20v14%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const path = window.location.pathname;
    // jen stránky, co začínají /live/ nebo /sports/
    if (!/^\/(?:live|sports)\//.test(path)) return;

    // vezmeme poslední segment číslic (ID zápasu)
    const m = path.match(/\/(\d+)\/?$/);
    if (!m) return;  // když poslední segment není čistě číslo

    const matchId = m[1];
    const target = `https://api-unblocker.kubecrawling1-tt2.pub.lskube.eu/fonbet/${matchId}`;
    window.location.replace(target);
})();