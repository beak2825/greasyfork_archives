// ==UserScript==
// @name         Looker Studio - Better Connector Editing Panel
// @namespace    https://lookerstudio.google.com/
// @version      0.1.20230330
// @description  Make better connector editing panel
// @license      MIT
// @author       cloudyyoung
// @match        https://lookerstudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lookerstudio.google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462954/Looker%20Studio%20-%20Better%20Connector%20Editing%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/462954/Looker%20Studio%20-%20Better%20Connector%20Editing%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // JQuery
    const s = document.createElement('script');
    s.type = "text/javascript";
    s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js";
    document.body.appendChild(s);

    // CSS
    document.head.innerHTML += (`
    <style>
        .connector-container .bi-engine-banner, .connector-container connector-gallery-card.in-viewport {
            display: none !important;
            height: 0px !important;
            max-height: 0px !important;
            padding: 0px !important;
        }
    </style>
    `);

})();