// ==UserScript==
// @name         Zhihu Dark Mode Auto-Enable
// @namespace    https://www.zhihu.com/
// @version      1.0
// @description  Automatically enable dark mode on Zhihu by adding ?theme=dark to the URL
// @author       wbw625
// @match        *://*.zhihu.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504390/Zhihu%20Dark%20Mode%20Auto-Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/504390/Zhihu%20Dark%20Mode%20Auto-Enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.search.includes("theme=dark")) {
        if (window.location.search) {
            window.location.href = window.location.href + "&theme=dark";
        } else {
            window.location.href = window.location.href + "?theme=dark";
        }
    }
    
})();
