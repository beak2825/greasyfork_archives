// ==UserScript==
// @name         Leitstellenspiel AutoFacebookLogin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Loggt Dich beim Aufruf der Seite automatisch per Facebook ein
// @author       jockel09
// @match        https://www.leitstellenspiel.de/users/sign_up
// @icon         https://www.google.com/s2/favicons?domain=leitstellenspiel.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488434/Leitstellenspiel%20AutoFacebookLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/488434/Leitstellenspiel%20AutoFacebookLogin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("accept-terms-and-services").checked = true;
    document.getElementById('big_facebook_button').click();
})();