// ==UserScript==
// @name         Change Color in Selector 2
// @namespace    your-namespace
// @version      1.0
// @description  Changes color in specified selector on sites including a specific URL
// @match        *://vanced-youtube.neocities.org/2015/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470718/Change%20Color%20in%20Selector%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470718/Change%20Color%20in%20Selector%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to change color
    GM_addStyle('.gsc-tabHeader.gsc-tabhActive { color: #dd4b39 !important; }');
})();
