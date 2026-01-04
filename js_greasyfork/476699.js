// ==UserScript==
// @name         Bypass VA Jira login loading bar
// @namespace    https://github.com/gileswells
// @version      1.0
// @description  Skip the loading bar when trying to login to Jira
// @author       Giles Wells
// @match        https://jira.devops.va.gov/login.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=va.gov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476699/Bypass%20VA%20Jira%20login%20loading%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/476699/Bypass%20VA%20Jira%20login%20loading%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.getElementById('stopAutoRedirect').click();
    }, 1000);
    setTimeout(() => {
        document.getElementById('redirectMessage').click();
    }, 1000);
})();