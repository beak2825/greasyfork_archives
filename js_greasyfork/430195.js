// ==UserScript==
// @name         BUW Moodle Login
// @version      1.0.1
// @description  Stay logged in on moodle.uni-wuppertal.de
// @author       Sufyan Dahalan <sufyan.dahalan@gmail.com>, forked from Zeno Sewald <zsewa@outlook.de>
// @namespace    https://github.com/SufyanDahalan

// @match        https://moodle.uni-wuppertal.de/
// @match        https://moodle.uni-wuppertal.de/login/index.php

// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430195/BUW%20Moodle%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/430195/BUW%20Moodle%20Login.meta.js
// ==/UserScript==

function redirect() {
    window.location.replace("https://moodle.uni-wuppertal.de/auth/shibboleth/index.php");
}

(function() {
    'use strict';

    const url = window.location.href;

    if (url === "https://moodle.uni-wuppertal.de/login/index.php" || url === "https://moodle.uni-wuppertal.de/") {
        redirect();
    }
})();