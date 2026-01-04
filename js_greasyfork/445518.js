// ==UserScript==
// @name         Login Script SMU LMS
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  auto login lms
// @author       You
// @match        https://lms.smu.edu.ph/login/index.php
// @match        https://lms.smu.edu.ph/
// @icon         https://static.wikia.nocookie.net/love-live/images/7/7b/Rina_Signature.png/revision/latest/scale-to-width-down/1200?cb=20210319113458
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445518/Login%20Script%20SMU%20LMS.user.js
// @updateURL https://update.greasyfork.org/scripts/445518/Login%20Script%20SMU%20LMS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentUrl = window.location.href;
    if (currentUrl === 'https://lms.smu.edu.ph/') {
        window.location.href = 'https://lms.smu.edu.ph/login/index.php';
    } else if (currentUrl === 'https://lms.smu.edu.ph/login/index.php') {
        document.getElementById('username').value = 'replace_username';
        document.getElementById('password').value = 'replace_password';
        document.getElementById('loginbtn').click();
    }

})();