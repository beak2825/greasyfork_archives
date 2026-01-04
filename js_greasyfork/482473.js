// ==UserScript==
// @name         NTNU Blackboard Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects the new and "improved" page to the old tabs style view
// @author       jpdragic
// @match        https://ntnu.blackboard.com/ultra/institution-page
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482473/NTNU%20Blackboard%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/482473/NTNU%20Blackboard%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = "https://ntnu.blackboard.com/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_70_1";
})();
