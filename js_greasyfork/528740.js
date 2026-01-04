// ==UserScript==
// @name         Auto Logout Google
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically logout from Google accounts when visiting Google websites.
// @author       Pencilheart
// @match        *://*.google.com/*
// @match        *://*.youtube.com/*
// @match        *://*.gmail.com/*
// @match        *://*.drive.google.com/*
// @match        *://*.photos.google.com/*
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528740/Auto%20Logout%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/528740/Auto%20Logout%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function logoutFromGoogle() {
        console.log("Checking Google login status...");

        let logoutUrl = "https://accounts.google.com/Logout";
        if (document.cookie.includes("SID=") || document.cookie.includes("SSID=")) {
            console.log("User is logged in. Logging out...");
            window.location.href = logoutUrl;
        }
    }

    document.addEventListener("DOMContentLoaded", logoutFromGoogle);
})();
