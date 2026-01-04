// ==UserScript==
// @name         Divisare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  paywall go away
// @author       Martino Mensio
// @match        https://divisare.com/**
// @icon         https://www.google.com/s2/favicons?domain=divisare.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429144/Divisare.user.js
// @updateURL https://update.greasyfork.org/scripts/429144/Divisare.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';
    let intervalId = null;
    const remove = () => {
        console.log('remove called');
        // re-enable scrolling
        const article = document.querySelector('body');
        article.style.overflow = 'auto';
        // remove paywall wrapper
        const elem = document.querySelector('div.blocker');
        if (elem) {
            elem.parentNode.removeChild(elem);
            console.log('done');
            clearInterval(intervalId);
        }
    };

    intervalId = setInterval(remove, 500);

})();