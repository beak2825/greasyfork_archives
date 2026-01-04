// ==UserScript==
// @name         MSN weather app page fixer
// @namespace    http://tampermonkey.net/
// @version      2025-05-25-1
// @description  Clean up msn weather to use as a web app to remove ads while using a popup blocker
// @author       guywmustang
// @match        https://www.msn.com/*/weather*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537186/MSN%20weather%20app%20page%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/537186/MSN%20weather%20app%20page%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery.noConflict();
    var $ = jQuery;

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100); // Check every 100ms
    }

    $(document).ready(() => {

        console.log("ready");

        // Usage
        waitForElement('.weatherMobileUpsellContainer-DS-EntryPoint1-1', (element) => {
            console.log('weather mobile link exists, clean up page:', element);
            // Perform actions on the element

            // Remove top bar
            $("#header").remove();

            // Remove mobile link garbage
            $(".weatherMobileUpsellRoot-DS-EntryPoint1-1 > div")[0].remove();
        });

        waitForElement('.commentOverlayContainer-DS-EntryPoint1-1', (element) => {
            console.log("removing comment div");

            element.remove();
        });
    });
})();