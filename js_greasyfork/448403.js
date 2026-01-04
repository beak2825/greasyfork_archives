// ==UserScript==
// @name         Amazon auto sort by review count
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  Automatically appends QSP s=review-count-rank on page start
// @author       James Sterling
// @include      https://www.amazon.com/*
// @include      https://smile.amazon.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/448403/Amazon%20auto%20sort%20by%20review%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/448403/Amazon%20auto%20sort%20by%20review%20count.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const amazonSearchUrls = ['https://www.amazon.com/s', 'https://smile.amazon.com/s']
    const sortQsp = '&s=review-count-rank';
    if (amazonSearchUrls.some(substr => window.location.href.startsWith(substr)) && !window.location.href.includes(sortQsp)) {
        console.log(`adding ${sortQsp}`);
        window.location.replace(`${window.location.href}${sortQsp}`)
    }
})();