// ==UserScript==
// @name           CaixaDirecta Sem Teclado Virtual
// @namespace      https://greasyfork.org/users/3063-miguel-p
// @include        https://caixadirectaonline.cgd.pt/cdo/*
// @description Enables using the keyboard on the login screen of the Portuguese Caixadirecta on-line homebanking service, rather than being restricted to the virtual on-screen keyboard.
// @version 0.0.1.20140626142038
// @downloadURL https://update.greasyfork.org/scripts/2834/CaixaDirecta%20Sem%20Teclado%20Virtual.user.js
// @updateURL https://update.greasyfork.org/scripts/2834/CaixaDirecta%20Sem%20Teclado%20Virtual.meta.js
// ==/UserScript==

(function () {
    function injectScript(scriptToInject) {
        var script = document.createElement('script'); 
        script.type = "text/javascript"; 
        script.innerHTML = scriptToInject;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    // this does things to the login page
    var userInput = document.getElementById('userInput');
    if(userInput) {
        // no keyboard hijacking, thanks
        document.onkeypress = null;
        
        // remove readonly attributes from input fields
        userInput.removeAttribute('readonly');
        var passwordInput = document.getElementById('passwordInput');
        passwordInput.removeAttribute('readonly');
        
        // virtual keyboard now stores the password itself in a global var, the password field is just a dummy
        // we need to copy the data from the dummy field into the global var before the site's form handler runs
        // (the site's handler performs the login via an ajax request)
        
        // login form has a submit handler, defined through an old version of JQuery. It's an anonymous function, nab a reference to it
        // might as well wipe it out through jquery too, since we already got our hands dirty with it
        injectScript("oldSubmitCallback = jQuery(loginForm).data('events').submit[0].handler; jQuery(loginForm).unbind('submit');");

        // Replace with our better callback that sets the global var to the proper password
        var newCallback = function newCallback(evt) {
            var realPassword = document.getElementById('loginForm').elements['passwordInput'].value;
            
            // check if the user actually used the virtual keyboard, don't overwrite the password with asterisks
            if(realPassword.indexOf("*") > -1) {
                injectScript("oldSubmitCallback();");
            } else {
                injectScript("login_password = '" + realPassword + "'; oldSubmitCallback();");
            }
        }
        document.getElementById('loginForm').addEventListener('submit', newCallback);

        // clear out login popup
        el = document.getElementById('modal_shadow_zero');
        el.parentNode.removeChild(el);
        el = document.getElementById('zeroHPModalPanel');
        el.parentNode.removeChild(el);
        userInput.focus();
    }
    
    // this does things to the post-login page
    var popupLogin = document.getElementById('modal_shadow_pzero');
    if(popupLogin) {
        // clear out the post-login popup
        el = document.getElementById('zeroHPModalPanel2');
        el.parentNode.removeChild(el);
        el = document.getElementById('modal_shadow_pzero');
        el.parentNode.removeChild(el);
    }
})();