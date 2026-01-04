// ==UserScript==
// @name         Set Bing Search page to dark mode by default
// @namespace    http://tampermonkey.net/
// @description  Automatically opens hamburger menu (2 secs after page load), once open will then automatically click on the dark mode toggle (1 sec after menu opens), then page will refresh in dark mode. This script excludes the shop page since Bing has no dark mode styles for that page/area. IMPORTANT: The version of Chrome which came out Mid Dec 2023 (Version 120.0.6099.71) for MacOS and PC doesn't support Bings Dark mode. So only use this script if Bing supports dark mode in your browser.
// @author       SauceCode
// @version      1.1
// @license MIT
// @match        http*://*.bing.com/*
// @exclude      http*://*.bing.com/?*
// @exclude      http*://*.bing.com/shop*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482342/Set%20Bing%20Search%20page%20to%20dark%20mode%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/482342/Set%20Bing%20Search%20page%20to%20dark%20mode%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // delay is needed otherwise page isn't ready for this !!
    setTimeout(function () {
        // only run if '.b_dark' class doesn't exist on body (shop page doesn't have dark mode, hence the exclude above)
        if (!document.body.classList.contains('b_dark')) {
            // open menu
            const siteHamburger = document.querySelector('#id_sc')
            siteHamburger.click()
            // second function needs to be on a delay too !!
            setTimeout(function () {
                // click dark radio button
                const darkModeToggle = document.querySelector('#rdiodark')
                darkModeToggle.click()
                // 
            }, 1000)
            //
        }
        //
    }, 2000)
    // end code
})();