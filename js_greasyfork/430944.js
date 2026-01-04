// ==UserScript==
// @name         Hide SFDC classic logo
// @namespace    window
// @version      0.1
// @description  It hides the SF logo from Classic - it works with custom logos too
// @author       You
// @match        https://*.salesforce.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430944/Hide%20SFDC%20classic%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/430944/Hide%20SFDC%20classic%20logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("phHeaderLogoImage").style.display = "none";
    
})();