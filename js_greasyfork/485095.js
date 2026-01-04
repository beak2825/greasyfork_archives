// ==UserScript==
// @name         Squarespace Help Center: Fix constant redirecting / reloading / refreshing
// @namespace    http://tampermonkey.net/
// @version      2024-01-18a
// @description  Stop the page from constantly redirecting / reloading / refreshing
// @author       adgitate
// @match        https://support.squarespace.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=squarespace.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485095/Squarespace%20Help%20Center%3A%20Fix%20constant%20redirecting%20%20reloading%20%20refreshing.user.js
// @updateURL https://update.greasyfork.org/scripts/485095/Squarespace%20Help%20Center%3A%20Fix%20constant%20redirecting%20%20reloading%20%20refreshing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.ZD_SSO_SETTINGS.enabled = false; //prevent squarespace launching a redirect
    fetch("https://login.squarespace.com/api/1/login/auth-status", {"credentials": "include"}) //check which account user logged into
        .then((response) => response.json())
        .then((data) => {
        if(window.HelpCenter.user.email != data.user.email){ //if doesn't match current cookies, then request them
            window.location.href = "https://squarespace.zendesk.com/auth/v2/login/signin?return_to=" + encodeURIComponent(window.location);
        }
    })
        .catch(console.error); //if user not logged in it responds code 401
})();