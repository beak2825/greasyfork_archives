// ==UserScript==
// @name         Unlazifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix grayed-out image embeds.
// @author       Aresiel
// @match        https://soranews24.com/*
// @icon         https://icons.duckduckgo.com/ip2/soranews24.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447395/Unlazifier.user.js
// @updateURL https://update.greasyfork.org/scripts/447395/Unlazifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("img.lazy").forEach(el => {
        el.src = el.getAttribute("data-sco-src")
        el.style.opacity = 1
    })
})();