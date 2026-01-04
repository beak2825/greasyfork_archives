// ==UserScript==
// @name         AWS_Color_Changer
// @namespace    http://tampermonkey.net/
// @version      2025-01-22
// @description  aws color changer
// @author       Svandrom
// @include      *console.aws.amazon.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/529481/AWS_Color_Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/529481/AWS_Color_Changer.meta.js
// ==/UserScript==

const accounts = [
    { account: "prurigh", color: "red" },
    { account: "inurigh", color: "#663399" }
];

function waitForPageLoad() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve);
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeAwsColor() {

    for(let account of accounts) {
        const matchingSpans = Array.from(document.querySelectorAll('span'))
        .filter(span => span.textContent.toLowerCase().includes(account.account.toLowerCase()));

        if (matchingSpans.length > 0) {
            const style = document.createElement("style");
            style.textContent = `
            .globalNav-223 {
                background-color: ${account.color} !important;
            }
        `;
            document.head.appendChild(style);
        }
    }
}

function checkRegion(region, message) {
    if (!window.location.href.includes(region)) {
        alert(message);
    }
}

(function() {
    'use strict';

    if (!window.location.href.includes("console.aws.amazon.com")) {
        return;
    }

    waitForPageLoad().then(() => {
        return sleep(2000);
    }).then(() => {
        checkRegion("eu-west-1", "BE CAREFUL ! You are not conencted on eu-west-1 !");
        changeAwsColor();
    });

}



    // Your code here...
)();