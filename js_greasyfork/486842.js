// ==UserScript==
// @name         西西河字号调整
// @namespace    http://tampermonkey.net/
// @version      0.1.20240206001
// @description  调整一下西西河的字号
// @author       xiaoyaoyuxin
// @match        *://*.talkcc.com/*
// @match        *://*.cchere.com/*
// @match        *://*.cchere.net/*
// @match        *://*.cchere.org/*
// @match        *://*.talkcc.com/*
// @match        *://*.talkcc.net/*
// @match        *://*.talkcc.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=talkcc.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486842/%E8%A5%BF%E8%A5%BF%E6%B2%B3%E5%AD%97%E5%8F%B7%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/486842/%E8%A5%BF%E8%A5%BF%E6%B2%B3%E5%AD%97%E5%8F%B7%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "p {font-size:16px;}";
document.head.appendChild(css);