// ==UserScript==
// @name         NO ADVERTISING ZERT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  without consequences
// @author       blahblah
// @match        https://triep.io/
// @icon         https://sun9-74.userapi.com/impg/6jY26kEuZ0qU5I9x7mdBOdQ2zA8pG8H9s3AkDw/BTLz1oDKei0.jpg?size=604x340&quality=96&sign=9fe860f5ff054a01d1ffef1c2f9c79fb&type=album
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513563/NO%20ADVERTISING%20ZERT.user.js
// @updateURL https://update.greasyfork.org/scripts/513563/NO%20ADVERTISING%20ZERT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function RemoveAds() {
        const elementRight = document.getElementById('triep-io_300x600');
        const elementBottom = document.getElementById('triep-io_970x250');

        if (elementRight) {
            elementRight.remove();
        }
        if (elementBottom) {
            elementBottom.remove();
        }
    }

    function startAdRemoval() {
        RemoveAds();
        setInterval(RemoveAds, 1);
    }

    window.addEventListener('load', startAdRemoval);

    document.body.addEventListener('click', RemoveAds);

})();
