// ==UserScript==
// @name         Basecamp 3 Widener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Basecamp Wide Again
// @author       Justin
// @match        *://3.basecamp.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/392437/Basecamp%203%20Widener.user.js
// @updateURL https://update.greasyfork.org/scripts/392437/Basecamp%203%20Widener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
GM_addStyle ( `
    .project-list__link {
        text-overflow: clip !important;
    }
    .list-view--projects {
        margin: 0.5rem 1rem 1rem;
    }
    .panel {
        max-width: 98vw !important;
    }
` );