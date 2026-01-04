// ==UserScript==
// @name         Medium to Freedium Redirector
// @namespace    none
// @version      0.1
// @description  Redirects Medium.com to Freedium.cfd
// @match        *://*.medium.com/*
// @downloadURL https://update.greasyfork.org/scripts/544108/Medium%20to%20Freedium%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/544108/Medium%20to%20Freedium%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newUrl = 'https://freedium.cfd' + window.location.pathname;
    window.location.replace(newUrl);
})();