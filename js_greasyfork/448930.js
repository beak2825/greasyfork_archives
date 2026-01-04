// ==UserScript==
// @name         Slack Login AutoClicker
// @namespace    Slack Login AutoClicker
// @version      0.1
// @description  Autoclicks on Sign In button in login page that appears every time Slack is launched
// @author       ffgonz
// @match        https://*.enterprise.slack.com/?redir=*
// @run-at       document-start
// @icon         https://a.slack-edge.com/5f35cf0/img/icons/favicon-32-ua.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448930/Slack%20Login%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/448930/Slack%20Login%20AutoClicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        document.getElementsByClassName("sign_in_sso_btn")[0].click();
    }
})();