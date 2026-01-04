// ==UserScript==
// @name         Auto Close Slack Tab on Redirect
// @namespace    https://*.slack.com/archives/*
// @version      0.3
// @description  Auto close Slack's "We’ve redirected you to the desktop app." tabs.
// @author       Tim Kersten
// @match        https://klarna.slack.com/archives/*
// @grant        none
// @homepageURL  https://gist.github.com/io41/304b1af0f83f82dd4408612b31bb25b5
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502685/Auto%20Close%20Slack%20Tab%20on%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/502685/Auto%20Close%20Slack%20Tab%20on%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The text to search for
    const redirectText = "We’ve redirected you to the desktop app.";

    // Function to check for the redirect element
    function checkForRedirect() {
        const redirectElement = document.querySelector('p.p-ssb_redirect__loading_messages');
        if (redirectElement && redirectElement.innerText.includes(redirectText)) {
            window.close();
        }
    }

    // Check for the element 2 seconds after loading
    setTimeout(checkForRedirect, 2000);
})();