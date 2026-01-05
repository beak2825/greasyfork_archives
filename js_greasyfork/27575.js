// ==UserScript==
// @name         Skip Intacct Landing Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect immediately to Intact login from the Intacct homepage.
// @author       Chelsea Voss
// @match        ^https://us.intacct.com/$
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27575/Skip%20Intacct%20Landing%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/27575/Skip%20Intacct%20Landing%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location = "https://www.intacct.com/ia/acct/login.phtml";
})();