// ==UserScript==
// @name         Change Color in Element fix
// @namespace    your-namespace
// @version      1.0
// @description  Changes color in specified element on sites including a specific URL
// @match        *://vanced-youtube.neocities.org/2015/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470717/Change%20Color%20in%20Element%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/470717/Change%20Color%20in%20Element%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to change color
    GM_addStyle('div[aria-label="refinement"][role="tab"].gsc-tabHeader.gsc-inline-block.gsc-tabhActive { color: #dd4b39 !important; }');
})();