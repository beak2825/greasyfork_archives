// ==UserScript==
// @name         Restore NU.NL scrollbar   
// @author       Marco Roossien
// @include      https://*.nu.nl/*
// @version      1.0
// @grant        none
// @run-at       document-start
// @description  Restore Scrollbar on NU.NL
// @namespace https://greasyfork.org/users/948097
// @downloadURL https://update.greasyfork.org/scripts/449811/Restore%20NUNL%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/449811/Restore%20NUNL%20scrollbar.meta.js
// ==/UserScript==
'use strict';
window.addEventListener('load', function() {
    javascript:var r="html,body{overflow:auto !important;}"; var s=document.createElement("style"); s.type="text/css"; s.appendChild(document.createTextNode(r)); document.body.appendChild(s); void 0;
}, false);