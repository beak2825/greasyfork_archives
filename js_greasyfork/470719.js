// ==UserScript==
// @name         Change Border Bottom Color
// @namespace    your-namespace
// @version      1.0
// @description  Changes border-bottom color in specified selector on sites including a specific URL
// @match        *://vanced-youtube.neocities.org/2015/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470719/Change%20Border%20Bottom%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/470719/Change%20Border%20Bottom%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to change border-bottom color
    GM_addStyle('body { border-bottom: 3px solid #dd4b39 !important; }');
})();