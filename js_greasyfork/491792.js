// ==UserScript==
// @name         AWS SSO Login Request Authorizer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Clicks the "Confirm and continue" button automatically when running `aws sso login`
// @author       Marc PEREZ
// @license      MIT
// @match        https://*.amazonaws.com/?*
// @match        https://*.awsapps.com/start/*
// @icon         https://d2q66yyjeovezo.cloudfront.net/icon/b5164fbdf0a4526876438e688f5e4130-8f4c3d179652d29309b38012bd392a52.svg
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/491792/AWS%20SSO%20Login%20Request%20Authorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/491792/AWS%20SSO%20Login%20Request%20Authorizer.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

// Change this to `false` if you don't want to close the tab automatically
const CLOSE_AFTER_ALLOW = true;

function click(buttons) {
    buttons[0].click();
}

// Authorization requested
// Find the "Confirm and continue" button and click it
waitForKeyElements("#cli_verification_btn", click);

// Allow access to your data?
// Find the "Allow" button and click it
waitForKeyElements('button[data-testid="allow-access-button"]', click);

// Close the page after a successful authrorization
function close(divs) {
    window.close();
}
if (CLOSE_AFTER_ALLOW) {
    waitForKeyElements('div[data-analytics-alert="success"]', close);
}