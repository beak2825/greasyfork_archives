// ==UserScript==
// @name         Hide login ID field
// @namespace    http://tampermonkey.net/
// @version      2025-04-03
// @description  A simple script that hides the ID field of a login page
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chrome.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535059/Hide%20login%20ID%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/535059/Hide%20login%20ID%20field.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function refresh() {
        var login = document.querySelectorAll('input[type="email"], input[type="username"], input[name="username"], input[name="IDToken1"], input[name="email"], input[id="username"], input[id="email"]');
        for (let i = 0; i < login.length; i++) {
            login[i].style['-webkit-text-security'] = 'disc';
            login[i].placeholder = "Field has been hidden";
        }
    }
    setInterval(refresh, 1000);
})();
