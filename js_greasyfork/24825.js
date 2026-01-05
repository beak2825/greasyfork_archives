// ==UserScript==
// @name         T-Square Auto click login
// @namespace    http://kingraham.me/
// @version      1.01
// @description  Auto clicks the login button on t-square
// @author       Karl Ingraham
// @match        https://t-square.gatech.edu/portal
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24825/T-Square%20Auto%20click%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/24825/T-Square%20Auto%20click%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link = document.getElementById('loginLink1');
    if (link.innerHTML == "Login") {
        link.click();
    }
})();