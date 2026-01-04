// ==UserScript==
// @name         Hide Tweet Views
// @match    https://twitter.com/*
// @version      0.2
// @description  Hides Tweet View Count
// @author       Andrei Onea
// @license      Apache-2.0
// @grant        none
// @namespace https://greasyfork.org/users/1001907
// @downloadURL https://update.greasyfork.org/scripts/457059/Hide%20Tweet%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/457059/Hide%20Tweet%20Views.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.textContent = 'a[href$="/analytics"] {display: none !important;}';
    document.head.appendChild(style);
})();