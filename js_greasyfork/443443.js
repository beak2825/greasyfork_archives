// ==UserScript==
// @name         Slack No APP
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  when SSO login slack, don't wait for spin app
// @author       NeverBehave
// @match        https://*.slack.com/ssb/redirect*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443443/Slack%20No%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/443443/Slack%20No%20APP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bt = boot_data.team_id
    if (bt) {
        location.href = `https://app.slack.com/client/${bt}`
    }
})();