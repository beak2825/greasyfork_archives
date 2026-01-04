// ==UserScript==
// @license      JazzMedo
// @name         Fuck Passwords
// @version      1.0
// @description  this script will always display the passwords
// @author       JazzMedo
// @match        *
// @include      *
// @icon         https://icons.veryicon.com/png/o/miscellaneous/remitting-country-linear-icon/password-148.png
// @grant        none
// @namespace https://greasyfork.org/users/1420266
// @downloadURL https://update.greasyfork.org/scripts/538012/Fuck%20Passwords.user.js
// @updateURL https://update.greasyfork.org/scripts/538012/Fuck%20Passwords.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var passwds = document.querySelectorAll('input[type="password"]')
    passwds.forEach(passwd => {
        passwd.removeAttribute("type", "")
    })
})();