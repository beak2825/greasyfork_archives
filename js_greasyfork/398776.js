// ==UserScript==
// @name            BFH-Moodle Login Automator
// @version         3.1
// @description     Automated login for moodle.bfh.ch via SWITCH edu-ID
// @author          rar0ch
// @namespace       https://greasyfork.org/de/users/469634-rar0ch

// @match           https://greasyfork.org/de/scripts/398776-bfh-moodle-login-automator
// @match           https://moodle.bfh.ch/
// @match           https://moodle.bfh.ch/local/bfh_dual_login/index.php
// @match           https://login.eduid.ch/idp/profile/SAML2/Redirect/SSO*

// @require         https://code.jquery.com/jquery-3.1.0.min.js

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/398776/BFH-Moodle%20Login%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/398776/BFH-Moodle%20Login%20Automator.meta.js
// ==/UserScript==

(function() {
    GM_registerMenuCommand('[TEL] Reset credentials', function() { GM_deleteValue('tel_credentials'); window.location.reload(); } );

    // Check if credentials are saved, triggered on first startup
    if(GM_getValue('tel_credentials', 0) === 0){
        first_startup();
    }

    // Getting values for webpage check
    var domain = location.href;

    // Page redirect and login function
    // Redirect BFH-Moodle Startpage
    if(domain.indexOf('https://moodle.bfh.ch/') != -1){
        $('input#wayf_submit_button.btn.btn-primary').click();
    }

    //Redirect BFH-Moodle-Login-Page
    if(domain.indexOf('https://moodle.bfh.ch/local/bfh_dual_login/index.php') != -1){
        $('input#wayf_submit_button.btn.btn-primary').click();
    }

    // SWITCH edu-ID Login
    if(domain.indexOf('login.eduid.ch/idp/profile/SAML2/Redirect/SSO') != -1){
        login_via_switch_eduid();
    }

})();

function first_startup() {
    // set-up dialog
    alert('Welcome. You triggered "BFH Moodle Login Automator" for the first time. Please perform the setup now. Have your SWITCH edu-ID credentials ready. Your credentials are stored local.');
    var username = prompt('Provide your SWITCH edu-ID email.');
    var password = prompt('Provide your password.');
    var tel_credentials = [username, password];
    GM_setValue('tel_credentials', tel_credentials);
    console.log( 'Saved credentials: '+GM_getValue('tel_credentials') );
}

function login_via_switch_eduid() {
    var username = GM_getValue('tel_credentials')[0];
    var password = GM_getValue('tel_credentials')[1];

    $('input#username').val(username);
    $('input#password').val(password);
    $('button.btn.btn-primary.btn-lg.btn-block').click();
}