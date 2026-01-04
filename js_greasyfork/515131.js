// ==UserScript==
// @name         Ozon CSS full small item title
// @namespace    http://tampermonkey.net/
// @version      2025.01.23
// @description  full small item title
// @author       k-dmitriy
// @match        https://ozon.ru/*
// @match        https://*.ozon.ru/*
// @match        http://ozon.ru/*
// @match        http://*.ozon.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/515131/Ozon%20CSS%20full%20small%20item%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/515131/Ozon%20CSS%20full%20small%20item%20title.meta.js
// ==/UserScript==

GM_addStyle ( `
    div.tile-root > div > a > div > span.tsBody500Medium {font-size: unset; font-weight: unset; letter-spacing: unset; line-height: unset;}
    div.tile-root > div > a > div {-webkit-line-clamp: 5;}
` );