// ==UserScript==
// @name         Working LBs
// @version      1.0
// @namespace https://discord.gg/nitrotype
// @description  Redirects users from NitroType leaderboards to the working 3rd party leaderboards.
// @author       jess
// @match        https://www.nitrotype.com/leaderboards
// @license GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/490128/Working%20LBs.user.js
// @updateURL https://update.greasyfork.org/scripts/490128/Working%20LBs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect URL
    var redirectUrl = "https://ntleaderboards.onrender.com/";

    // Redirects user
    window.location.replace(redirectUrl);
})();
