// ==UserScript==
// @name         Slack Layout UI Restore
// @namespace    https://github.com/bpetrynski/
// @version      0.1
// @description  A script to restore the old Slack UI layout, reverting the changes made in the September 2023 update.
// @author       Bartosz Petrynski
// @match        https://*.slack.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/475463/Slack%20Layout%20UI%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/475463/Slack%20Layout%20UI%20Restore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let localConfig = localStorage.getItem("localConfig_v2");
    if (localConfig) {
        localConfig = localConfig.replace(/\"is_unified_user_client_enabled\":true/g, '\"is_unified_user_client_enabled\":false');
        localStorage.setItem("localConfig_v2", localConfig);
    }
})();
