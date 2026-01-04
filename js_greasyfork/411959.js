// ==UserScript==
// @name         Slack Web Workspace Sidebar
// @description  Enable the workspace sidebar on the web version of Slack.
// @namespace    https://github.com/PiDelport/
// @author       Pi Delport <pjdelport@gmail.com>
// @version      1.0
// @license      MIT
// @homepageURL  https://gist.github.com/PiDelport/513676916e8fc186a09edfc8965a410b
// @match        https://app.slack.com/*
// @downloadURL https://update.greasyfork.org/scripts/411959/Slack%20Web%20Workspace%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/411959/Slack%20Web%20Workspace%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // See:
    // https://webapps.stackexchange.com/questions/144258/slacks-web-version-shows-workspace-switching-sidebar-but-only-on-chromebooks
    //
    // This seems to be the minimal change to make Slack detect Chrome OS, as of 2020-09-25:
    Object.defineProperty(navigator, 'userAgent', {
        value: navigator.userAgent + ' CrOS'
    });

})();