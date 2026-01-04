// ==UserScript==
// @name         Custom BG for LOLZ
// @version      1.2
// @description  Theme for change background on LOLZ
// @author       Суетолог
// @match        *://*.lolz.guru/*
// @match        *://*.lolz.live/*
// @match        *://*.zelenka.guru/*
// @match        *://*.lzt.market/*
// @match        *://*.lolz.market/*
// @run-at       document-start
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @namespace    https://lolz.live/lztf
// @downloadURL https://update.greasyfork.org/scripts/523492/Custom%20BG%20for%20LOLZ.user.js
// @updateURL https://update.greasyfork.org/scripts/523492/Custom%20BG%20for%20LOLZ.meta.js
// ==/UserScript==

let img; img = "https://i.imgur.com/CJBtgKA.png"
let theme; theme = `body{background-image:linear-gradient(rgba(37,37,37,0.8),rgba(37,37,37,0.8)),url(${img});background-size:100%;background-attachment:fixed;color:#d6d6d6;}`

GM_addStyle(theme);