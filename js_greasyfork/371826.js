// ==UserScript==
// @name         SparqlTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  We all want a browser width player
// @author       Ian L. Johnson
// @match        https://livetv.sparql.nl/program.aspx
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371826/SparqlTV.user.js
// @updateURL https://update.greasyfork.org/scripts/371826/SparqlTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle('.column          { float:none !important;}');
    GM_addStyle('.column.main     { width:100% !important;}');
    GM_addStyle('.pageContent     { width:100% !important;}');
    GM_addStyle('.content-wrapper { width:100% !important;}');
    GM_addStyle('#player          { width:100% !important; height:100% !important;}');

})();