// ==UserScript==
// @name         Google Redirect Notice Bypasser
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Automatically clicks the specified link on Google's redirect notice page because the page is so annoying.
// @author       Liam
// @match        https://www.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491349/Google%20Redirect%20Notice%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/491349/Google%20Redirect%20Notice%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started.');

    console.log('Checking if the page contains the redirect notice...');
    if(document.querySelector('.mymGo > .aXgaGb > font > b')) {
        console.log('Redirect notice found.');

        var redirectLink = document.querySelector('.fTk7vd a');
        if(redirectLink) {
            console.log('Redirect link found. Clicking...');
            redirectLink.click();
            console.log('Redirect link clicked.');
        } else {
            console.log('Redirect link not found.');
        }
    } else {
        console.log('Redirect notice not found.');
    }
})();