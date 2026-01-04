// ==UserScript==
// @name         Roblox Login Symbol Unblock (Visual Only)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows any symbols in Roblox login input boxes (for testing / frontend only)
// @author       You
// @match        *://www.roblox.com/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540808/Roblox%20Login%20Symbol%20Unblock%20%28Visual%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540808/Roblox%20Login%20Symbol%20Unblock%20%28Visual%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unlockLoginFields() {
        const username = document.querySelector("input[name='username']");
        const password = document.querySelector("input[name='password']");

        [username, password].forEach(input => {
            if (input) {
                input.removeAttribute("maxlength");
                input.setAttribute("placeholder", "Enter anything 👾🎉🧠💻");
                input.addEventListener("input", () => {
                    // This won't help bypass the login — just lets you enter symbols
                    input.style.border = "2px solid green";
                });
            }
        });
    }

    window.addEventListener("load", unlockLoginFields);
})();