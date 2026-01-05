// ==UserScript==
// @name          Add Opensearch Link
// @namespace     https://github.com/ohdeerdog/
// @version       0.1
// @description   Appends missing Opensearch link from https://github.com/opensearch-directory/opensearch-directory
// @author        ohdeerdog
// @match         *://*
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/28417/Add%20Opensearch%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/28417/Add%20Opensearch%20Link.meta.js
// ==/UserScript==

(function() {
  if (!document.querySelector('link[rel="search"]')) {
    let hostname = location.hostname.split('.').slice(-2).join('.');
    let link = document.createElement('link');
    link.rel = 'search';
    link.type = 'application/opensearchdescription+xml';
    link.href = 'https://rawgit.com/opensearch-directory/opensearch-directory/master/' + hostname + '.html.xml';
    link.title = document.title;
    document.head.appendChild(link);
  }
})();
