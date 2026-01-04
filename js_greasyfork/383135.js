// ==UserScript==
// @name            Semi-automatic login Unipd SSO
// @name:it         Login semi-automatico SSO Unipd
// @description     This script tries to automatically login when you're logged off. If it fails you can login by clicking anywhere on the webpage. Requires autofill-in to be enabled.
// @description:it  Questo script prova a fare il login automaticamente. Se non ci riesce potrai loggarti cliccando ovunque nella pagina. Richiede che l'autofill-in sia abilitato.
// @namespace       RZ
// @author          RZ
// @version         2019.06.02
// @match           https://elearning.dei.unipd.it/*
// @match           https://shibidp.cca.unipd.it/idp/profile/SAML2/Redirect/SSO*
// @run-at          document-end
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/384214/Semi-automatic%20login%20Unipd%20SSO.user.js
// @updateURL https://update.greasyfork.org/scripts/384214/Semi-automatic%20login%20Unipd%20SSO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lang = 'it'; // ['en', 'it']

    // HOW THIS SCRIPT WORKS:
    // Normally the login page loads with a username input box that is populated by the autofill-in.
    // 50ms after event window.onload this input box is programmatically set hidden and a new input box is set visible,
    // but the filled-in content is not copied over. When hitting login, the content of the new input box is formatted and copied to the old input box.
    // This script copies the hidden filled-in username to the new input box and submits the login request.
    // NOTE: When logging in for the first time, Chrome learns the username as in the old input box that always contains the @ domain,
    // so clicking the radio button is not required.
    // Due to a Chrome bug, sometimes the autofill-in data is undetectable from javascript or html until an event is raised by the user (e.g. clicking).
    // You can see yourself that in those instances neither the Chrome developer tools window shows the filled in data.

    var LOGIN_OK_STR = {'en': "LOGGING IN...", 'it': "LOGIN IN CORSO..."};
    var CLICK_TO_LOGIN = {'en': "PLEASE CLICK ANYWHERE TO LOGIN", 'it': "CLICCA OVUNQUE PER ACCEDERE"};
    var NO_LOGIN_DATA_STR = {'en': "MISSING USERNAME OR PASSWORD. CHECK THAT THE AUTOFILL-IN IS ENABLED. (THIS MESSAGE CAN APPEAR DUE TO AN AUTOFILL-IN BUG)",
                             'it': "NOME UTENTE O PASSWORD NON TROVATI. ASSICURATI DI AVERE L'AUTOFILL-IN ABILITATO. (QUESTO MESSAGGIO PUO' COMPARIRE A CAUSA DI UN BUG DELL'AUTOFILL-IN)"};
    var LOST_LOGIN_DATA_STR = {'en': "FILL-IN DATA HAS BEEN LOST. PLEASE RE-ENTER USERNAME AND PASSWORD",
                               'it': "I DATI DI FILL-IN SONO STATI PERSI. REINSERISCI USERNAME E PASSWORD."};
    var WRONG_DATA_STR = {'en': "WRONG USERNAME OR PASSWORD", 'it': "NOME UTENTE O PASSWORD SBAGLIATI"};

    var $ = window.jQuery;
    var current_url = window.location.href;
    if (current_url.startsWith('https://elearning.dei.unipd.it')) {
        if ($('.login').length === 1) {
            window.location = 'https://elearning.dei.unipd.it/auth/shibboleth/index.php';
        }
    } else if (current_url.startsWith('https://shibidp.cca.unipd.it/idp/profile/SAML2/Redirect/SSO')) {

        var title = $('h1').first();
        title.html(LOGIN_OK_STR[lang]).css({'font-size': '30px', 'font-weight': 'bold'});

        var login_fn = function() {
            var user_str = $('#j_username').val();
            console.log('User: ', user_str);
            var is_valid_user = !user_str.startsWith('nome.cognome@') && user_str !== '';
            if (is_valid_user) {
                $('#j_username_js').val(user_str);
                $('#login_button_js').click();
                console.log('login!');
            }
            return is_valid_user;
        };

        if ($('#messaggierrore').length === 1) {
            title.html(WRONG_DATA_STR[lang]);
        } else {
            setTimeout(function() {
                if (!login_fn()) {
                    title.html(CLICK_TO_LOGIN[lang]);
                    $('body').click(function() {
                        console.log('clicked');
                        $('body').off('click');
                        if(!login_fn()) {
                            var user_str = $('#j_username').val();
                            if (user_str === '') {
                                title.html(NO_LOGIN_DATA_STR[lang]);
                            } else if (user_str.startsWith('nome.cognome@')) {
                                title.html(LOST_LOGIN_DATA_STR[lang]);
                            }
                        }
                    });
                }
            }, 500);
        }
    }
})();