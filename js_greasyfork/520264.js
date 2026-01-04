// ==UserScript==
// @name         Skip Datadog mobile login page
// @namespace    http://tampermonkey.net/
// @version      2024-12-09
// @description  When logging in to Datadog using SAML, it takes you to a page that asks you whether you want to be using the mobile app.  This is usually not useful to you on desktop, so this userscript skips this page directly into the app.
// @author       You
// @match        https://app.datadoghq.com/account/login/mobile?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datadoghq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520264/Skip%20Datadog%20mobile%20login%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/520264/Skip%20Datadog%20mobile%20login%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkOnReady() {
        if (document.readyState === "complete") {
            clickWebsiteButton();
        }
    }

    function clickWebsiteButton() {
        const button = document.querySelector("a[type=button]:not([href^=\"datadog://\"])");

        if (button) {
            button.click()
        }
    }

    checkOnReady();
    document.addEventListener("readystatechange", checkOnReady);
})();