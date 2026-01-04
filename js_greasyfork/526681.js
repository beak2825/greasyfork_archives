// ==UserScript==
// @name         Cardmarket Always Gallery Mode
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Always enable gallery mode on Cardmarket search
// @author       Your Name
// @match        https://www.cardmarket.com/*/*/Products/Search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526681/Cardmarket%20Always%20Gallery%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/526681/Cardmarket%20Always%20Gallery%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (!params.has('mode') || params.get('mode') !== 'gallery') {
        params.set('mode', 'gallery');
        window.location.replace(url.origin + url.pathname + '?' + params.toString());
    }
})();
