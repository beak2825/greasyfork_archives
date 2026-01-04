// ==UserScript==
// @name         Quora Login Overlay Bypasser
// @namespace    MirazMac\UserScripts\QuoraBypasser
// @version      0.1
// @license      The MIT License
// @description  Bypass those annoying as fuck sign-in overlays from Quora
// @author       Miraz Mac
// @icon         https://qsf.ec.quoracdn.net/-3-images.favicon.ico-26-3f34badcb59c8f6c.ico
// @homepageURL  https://github.com/MirazMac/quora-login-overlay-bypasser-userscript
// @supportURL   https://github.com/MirazMac/quora-login-overlay-bypasser-userscript/issues
// @match        *://www.quora.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370599/Quora%20Login%20Overlay%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/370599/Quora%20Login%20Overlay%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.querySelector("body");

    // check current user state
    var isNonLogged = false;

    if (body.classList.contains('logged_out')) {
        isNonLogged = true;
    }

    // user's logged in, no point in wasting memory then
    if (!isNonLogged) {
        return false;
    }

    // Remove the preventation class
    body.classList.remove("signup_wall_prevent_scroll");

    // Remove the modal
    var baseSignUpForm = document.querySelector('.BaseSignupForm');
    baseSignUpForm.style.display = 'none';

    // Add additional css fix, in case the methods above don't work
    var css = '.signup_wall_prevent_scroll{overflow:auto!important} .signup_wall_prevent_scroll .SiteHeader, .signup_wall_prevent_scroll .LoggedOutFooter, .signup_wall_prevent_scroll .ContentWrapper, .signup_wall_prevent_scroll #root {filter:none!important}';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
       style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
})();
