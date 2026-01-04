// ==UserScript==
// @name         Disable OpenSearch
// @namespace    Disable OpenSearch
// @version      1.0
// @description  Remove the OpenSearch <link> tag to prevent Google Chrome from auto-adding custom search engines.
// @author       Snie
// @match        http*://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37186/Disable%20OpenSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/37186/Disable%20OpenSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
var elOpenSearch = document.querySelector('[type="application/opensearchdescription+xml"]');
if (elOpenSearch) elOpenSearch.remove();
})();