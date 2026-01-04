// ==UserScript==
// @name        Duolingo Enable Dark Mode
// @namespace   zys52712
// @match       https://*.duolingo.com/*
// @version     1.0
// @license     GNU GPLv3
// @author      zys52712
// @description enables native dark mode for Duolingo
// @downloadURL https://update.greasyfork.org/scripts/465234/Duolingo%20Enable%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/465234/Duolingo%20Enable%20Dark%20Mode.meta.js
// ==/UserScript==

document.querySelector('html').dataset.duoTheme = 'dark';