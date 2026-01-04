// ==UserScript==
// @name         LMU Moodle Login
// @version      1.0.1
// @description  Stay logged in on moodle.lmu.de
// @author       Zeno Sewald <zsewa@outlook.de>
// @namespace    https://github.com/zsewa
// @homepageURL  https://github.com/zsewa/userscript_lmu_moodle_login

// This script triggers on the LMU Moodle main page and the site policy page.
// A non-logged in user is redirected to the site policy page when accessing courses or the dashboard.

// @match        https://moodle.lmu.de/
// @match        https://moodle.lmu.de/user/policy.php

// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402556/LMU%20Moodle%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/402556/LMU%20Moodle%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // check if user is logged in
    const loginStatusIndicator = document.getElementsByClassName("login")[0];
    if ("You are not logged in. (Log in)" === loginStatusIndicator.textContent ||
        "You are currently using guest access (Log in)" === loginStatusIndicator.textContent) {
        // redirect to LMU login provider page
        window.location.replace("https://moodle.lmu.de/Shibboleth.sso/Login?entityID=https%3A%2F%2Flmuidp.lrz.de%2Fidp%2Fshibboleth&target=https%3A%2F%2Fmoodle.lmu.de%2Fauth%2Fshibboleth%2Findex.php");
    }
})();
