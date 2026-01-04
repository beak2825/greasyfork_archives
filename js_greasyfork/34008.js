// ==UserScript==
// @name            TUM-Moodle Login Automator BETA
// @version         0.3
// @description     Automated login for tum.moodle.de. Also performs login process on Shibboleth-LRZ with your TUM (Technnische Universitaet Muenchen) credentials.
// @author          zsewa
// @namespace       https://greasyfork.org/users/57483

// @match           https://greasyfork.org/de/scripts/34008-tum-everywere-login-beta
// @match           https://www.moodle.tum.de/
// @match           https://campus.tum.de/tumonline/webnav.ini
// @match           https://tumidp.lrz.de/idp/profile/SAML2/Redirect/SSO*

// @require         https://code.jquery.com/jquery-3.1.0.min.js

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/34008/TUM-Moodle%20Login%20Automator%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/34008/TUM-Moodle%20Login%20Automator%20BETA.meta.js
// ==/UserScript==



(function() {
    GM_registerMenuCommand('[TEL] Reset credentials', function() { GM_deleteValue('tel_credentials'); window.location.reload(); } );

    //check if credentials are saved, triggered on first startup
    if(GM_getValue('tel_credentials', 0) === 0){
        first_startup();
    }
    
    //getting values for webpage check
    var domain = location.href;
    
    //__Page redirect or login function__
    //TUM-Moodle Startpage
    if(domain.indexOf('https://www.moodle.tum.de/') != -1){
        location.href='https://www.moodle.tum.de/Shibboleth.sso/Login?providerId=https%3A%2F%2Ftumidp.lrz.de%2Fidp%2Fshibboleth&target=https%3A%2F%2Fwww.moodle.tum.de%2Fauth%2Fshibboleth%2Findex.php';
    }

    /*
    //Campus Online - NOT WORKING
    if(domain.indexOf('https://campus.tum.de/tumonline/webnav.ini') != -1){
        alert('Campus Online');
        detail.location = 'wbanmeldung.durchfuehren';
        location.href = "javascript:void(submit_login());";
    }
    */

    //Shibboleth Login on LRZ
    if(domain.indexOf('tumidp.lrz.de/idp/profile/SAML2') != -1){
        login_via_shibboleth();
    }
    
})();


function first_startup() {
    //set-up dialog
    alert('Welcome. You triggered "TUM Everywere Login BETA" for the first time. Please perform the setup now. Have your TUM credentials ready. Your credentials are stored local.');
    var username = prompt('Provide your username. e.g.: "ga12abc"');
    var password = prompt('Provide your password.');
    //var tel_credentials = []
    var tel_credentials = [username, password];
    GM_setValue('tel_credentials', tel_credentials);
    console.log( 'Saved credentials: '+GM_getValue('tel_credentials') );
}

function login_via_shibboleth() {
    var username = GM_getValue('tel_credentials')[0];
    var password = GM_getValue('tel_credentials')[1];
    
    $('input#username').val(username);
    $('input#password').val(password);
    $('button.btnLogin').click();
}