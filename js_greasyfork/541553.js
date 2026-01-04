// ==UserScript==
// @name         Google utm 14 for iOS default search
// @namespace    http://saru.moe/
// @version      2025-07-03
// @description  Try to add utm 14 for google search only for iOS default search engine
// @author       DannyAAM
// @license      MIT
// @match        https://www.google.com/search*
// @icon         https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541553/Google%20utm%2014%20for%20iOS%20default%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/541553/Google%20utm%2014%20for%20iOS%20default%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    if (url.searchParams.get("client") != "safari") return;
    if (url.searchParams.get("udm")) return;
    url.searchParams.set("udm", "14");
    window.location.replace(url);
})();
