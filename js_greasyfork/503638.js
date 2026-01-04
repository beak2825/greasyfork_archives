// ==UserScript==
// @name         YouTube TrustedHTML Bypass
// @namespace    c0d3r
// @license      MIT
// @version      0.1
// @description  Bypass errors with userscripts caused by YouTube's TrustedHTML policy
// @author       c0d3r
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503638/YouTube%20TrustedHTML%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/503638/YouTube%20TrustedHTML%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // WORKAROUND: TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.
    if (window.trustedTypes && trustedTypes.createPolicy) {
        if (!trustedTypes.defaultPolicy) {
            const passThroughFn = (x) => x;
            trustedTypes.createPolicy('default', {
                createHTML: passThroughFn,
                createScriptURL: passThroughFn,
                createScript: passThroughFn,
            });
        }
    }
})();