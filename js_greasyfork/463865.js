// ==UserScript==
// @name         Crunchyroll MOD
// @namespace    crunchyroll-mod
// @version      5
// @description  Crunchyroll login information box with copy button by WA
// @author       [WA]
// @match        https://www.crunchyroll.com/*
// @grant        GM_addStyle
// @license      MIT Sm Clan
// @downloadURL https://update.greasyfork.org/scripts/463865/Crunchyroll%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/463865/Crunchyroll%20MOD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // check if on login page or not
    var onLoginPage = location.pathname === "/ar/welcome/login";

    // login information
    var email = "omarrobux04@gmail.com";
    var password = "smclan56";

    // create login information box
    if (onLoginPage) {
        var loginBox = document.createElement("div");
        loginBox.style.position = "fixed";
        loginBox.style.top = "50px";
        loginBox.style.right = "50px";
        loginBox.style.padding = "10px";
        loginBox.style.backgroundColor = "white";
        loginBox.style.border = "1px solid #dcdcdc";
        loginBox.style.borderRadius = "5px";
        loginBox.style.boxShadow = "0 0 10px rgba(0,0,0,.1)";
        loginBox.innerHTML = "<p style='font-size: 16px; font-weight: bold;'>Crunchyroll Login Information</p><hr style='margin: 5px 0; border: none; border-top: 1px solid #dcdcdc;'>"+
            "<p style='margin-top: 10px; font-size: 14px;'>Email: <span style='color: #3a3a3a; font-weight: bold;'>" + email + "</span></p>"+
            "<p style='margin-top: 10px; font-size: 14px;'>Password: <span style='color: #3a3a3a; font-weight: bold;'>" + "*".repeat(password.length) + "</span></p>"+
            "<button id='copyButton' style='margin-top: 15px; padding: 5px 10px; font-size: 14px; font-weight: bold; border: none; border-radius: 5px; background-color: #1f1f1f; color: white; cursor: pointer;'>Copy</button>";
        document.body.appendChild(loginBox);

        // add copy button functionality
        var copyButton = document.getElementById("copyButton");
        copyButton.onclick = function() {
            var loginInfo = "Email: " + email + "\nPassword: " + password;
            navigator.clipboard.writeText(loginInfo);
            alert("Login information copied to clipboard!");
        };
    }

    // apply CSS styles
    GM_addStyle(`
        #copyButton:hover {
            background-color: #2f2f2f;
        }

        /* Hide the avatar header tile */
        .erc-header-tile {
            display: none;
        }

        /* Style the modified broadcast message */
        .broadcast-message__message---RtQ- {
            background-color: #1f1f1f;
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
        }

        /* Add Sm Clan Mod text to the modified broadcast message */
        .broadcast-message__message---RtQ-:before {
            content: "Sm Clan Mod: ";
        }

        /* Hide the verification link button */
        .broadcast-message__button--Yf

.broadcast-message__button--YfXph {
    display: none !important;
}
  }
    `);
})();