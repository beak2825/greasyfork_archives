// ==UserScript==
// @name         Reddit - Switch to 'Submitted' by default on user profile view
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  99% of the time I want to view the 'Submitted' tab, and occasionally the 'Comments' tab. Never 'Overview', so this'll always redirect from overview to submitted.
// @author       You
// @match        https://*.reddit.com/user/*
// @match        https://*.reddit.com/user/*/
// @exclude      https://*.reddit.com/user/*/submitted*
// @exclude      https://*.reddit.com/user/*/comments*
// @icon         https://*.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500518/Reddit%20-%20Switch%20to%20%27Submitted%27%20by%20default%20on%20user%20profile%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/500518/Reddit%20-%20Switch%20to%20%27Submitted%27%20by%20default%20on%20user%20profile%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.location = document.querySelector('.choice[href*="submitted"]').href;
})();