// ==UserScript==
// @name         Bustimes and Transportthing Detailed View Enforcer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically adds ?detailed=1 or &detailed=1 to bustimes.org and transportthing.uk pages
// @match        *://*.bustimes.org/*
// @match        *://*.transportthing.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534962/Bustimes%20and%20Transportthing%20Detailed%20View%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/534962/Bustimes%20and%20Transportthing%20Detailed%20View%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    // Don't do anything if detailed=1 is already present
    if (url.searchParams.get("detailed") === "1") {
        return;
    }

    url.searchParams.set("detailed", "1");

    // Only reload if necessary
    if (window.location.href !== url.href) {
        window.location.replace(url.href);
    }
})();
