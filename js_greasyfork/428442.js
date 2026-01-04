// ==UserScript==
// @name         Il Messaggero - paywall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read articles from ilmessaggero.it
// @author       You
// @match        https://www.ilmessaggero.it/*
// @icon         https://www.google.com/s2/favicons?domain=ilmessaggero.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428442/Il%20Messaggero%20-%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/428442/Il%20Messaggero%20-%20paywall.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';
    const remove = () => {
        console.log('remove called');
        // re-enable scrolling
        const article = document.querySelector('#premium');
        article.style.overflow = 'auto';
        // remove paywall wrapper
        const elem = document.querySelector('#paywall_wrapper');
        elem.parentNode.removeChild(elem);
    };

    setTimeout(remove, 5000);

})();