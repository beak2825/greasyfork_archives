// ==UserScript==
// @name         Youtube Always Dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Always youtube dark mode
// @author       Liam Wang
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402782/Youtube%20Always%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/402782/Youtube%20Always%20Dark.meta.js
// ==/UserScript==
document.cookie = "PREF=f1=50000000&al=en&f4=4000000&f5=20000&f6=400; domain=.youtube.com";