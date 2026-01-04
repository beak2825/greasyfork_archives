
// ==UserScript==
// @name         Replace Live Studio with (old) Live Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes yt livestreaming great again.
// @author       RORIdev
// @match        https://studio.youtube.com/channel/*/livestreaming
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395188/Replace%20Live%20Studio%20with%20%28old%29%20Live%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/395188/Replace%20Live%20Studio%20with%20%28old%29%20Live%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirects to old live_dashboard
    window.location.replace("https://www.youtube.com/live_dashboard?nv=1")

})();