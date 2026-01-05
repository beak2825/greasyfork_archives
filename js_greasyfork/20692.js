// ==UserScript==
// @name            [ALL] Block OpenSearch Descriptions (OSD)
// @author
// @description     Block sites from adding search engines to Chrome.
// @downloadURL
// @grant
// @homepageURL     https://bitbucket.org/INSMODSCUM/userscripts-scripts/src
// @icon
// @include         http*://*
// @namespace       insmodscum 
// @require
// @run-at          document-start
// @updateURL
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/20692/%5BALL%5D%20Block%20OpenSearch%20Descriptions%20%28OSD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20692/%5BALL%5D%20Block%20OpenSearch%20Descriptions%20%28OSD%29.meta.js
// ==/UserScript==

document.querySelector('[type="application/opensearchdescription+xml"]').remove();