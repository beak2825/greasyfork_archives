// ==UserScript==
// @name         RedirectMePLS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  forum and market redirector
// @author       maybebrill
// @license      MIT
// @match        *://*.lolz.guru/*
// @match        *://*.zelenka.guru/*
// @match        *://*.lolz.market/*
// @match        *://*.zelenka.market/*
// @match        *://*.lolz.live/*
// @match        *://*.lzt.market/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516582/RedirectMePLS.user.js
// @updateURL https://update.greasyfork.org/scripts/516582/RedirectMePLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const forum = 'lolz.live'; // замените на свою желаемую ссылку, доступные: lolz.live, lolz.guru, zelenka.guru
    const market = 'lzt.market'; // замените на свою желаемую ссылку, доступные: lzt.market, lolz.market, zelenka.market

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    
    if ((url.hostname.includes('lolz.guru') || url.hostname.includes('zelenka.guru') || url.hostname.includes('lolz.live')) && !url.hostname.includes(forum)) {
        const newUrl = new URL(currentUrl);
        newUrl.hostname = newUrl.hostname.replace(/lolz\.guru|zelenka\.guru|lolz\.live/, forum);
        window.location.replace(newUrl.toString());
    }
    
    if ((url.hostname.includes('lolz.market') || url.hostname.includes('zelenka.market') || url.hostname.includes('lzt.market')) && !url.hostname.includes(market)) {
        const newUrl = new URL(currentUrl);
        newUrl.hostname = newUrl.hostname.replace(/lolz\.market|zelenka\.market|lzt\.market/, market);
        window.location.replace(newUrl.toString());
    }
})();
