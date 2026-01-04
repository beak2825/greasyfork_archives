// ==UserScript==
// @name         Open Google's New "Web" Search by Default
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Opens recently added Google "Web" results by adding the &udm=14 parameter to every Google search URL
// @author       Vicky R
// @icon         https://www.google.com/s2/favicons?domain=www.google.com
// @match        *://www.google.com/search*
// @license            GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495275/Open%20Google%27s%20New%20%22Web%22%20Search%20by%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/495275/Open%20Google%27s%20New%20%22Web%22%20Search%20by%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const paramName = 'udm';
    const paramValue = '14';
    const sessionKey = 'udm_added';

    // Check if the URL already contains the 'udm=14' parameter or if it was already added in this session
    const url = new URL(window.location);
    const udmParam = url.searchParams.get(paramName);
    const udmAdded = sessionStorage.getItem(sessionKey);

    if (udmParam !== paramValue && !udmAdded) {
        // Add the 'udm=14' parameter
        url.searchParams.set(paramName, paramValue);
        sessionStorage.setItem(sessionKey, 'true');
        window.location.replace(url.toString());
    }
})();
