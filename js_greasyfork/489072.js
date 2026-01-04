// ==UserScript==
// @name        Mediapart BNF redirect
// @match       *://*.mediapart.fr/*
// @run-at      document-start
// @grant       none
// @description Redirects Mediapart articles to BNF website
// @license     MIT
// @version 0.0.1.20240305134723
// @namespace https://greasyfork.org/users/1270652
// @downloadURL https://update.greasyfork.org/scripts/489072/Mediapart%20BNF%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/489072/Mediapart%20BNF%20redirect.meta.js
// ==/UserScript==

var oldUrlPath  = window.location.pathname;


var newURL  = window.location.protocol + "//"
            + "www-mediapart-fr.bnf.idm.oclc.org"
            + oldUrlPath
            + window.location.search
            + window.location.hash
            ;
    
window.location.replace (newURL);