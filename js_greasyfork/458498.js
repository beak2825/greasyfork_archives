// ==UserScript==
// @name         [Autemo] Fix for missing chat & profile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A quick and hopefully temporary fix, hope Hui can get this fixed ASAP.
// @author       Daniel Talhaug
// @match        https://www.autemo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autemo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458498/%5BAutemo%5D%20Fix%20for%20missing%20chat%20%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/458498/%5BAutemo%5D%20Fix%20for%20missing%20chat%20%20profile.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const createMetaEl = () => {
        const el = document.createElement('meta');
        // do magic
        el.httpEquiv = 'Content-Security-Policy';
        el.content = 'upgrade-insecure-requests';

        return el;
    };

    const appendMetaToHead = () => {
        const head = document.getElementsByTagName('head')[0];

        head.appendChild(createMetaEl());
    };

    appendMetaToHead();
})();