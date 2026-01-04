// ==UserScript==
// @name         AWS Console - Open All SSO Accounts
// @match        https://*.awsapps.com/start/*
// @grant        none
// @version      1.1
// @author       Bernd VanSkiver
// @description  Open all accounts and roles on AWS Console SSO screen used by AWS IAM Identity Center.
// @namespace    https://greasyfork.org/users/1009418
// @downloadURL https://update.greasyfork.org/scripts/457921/AWS%20Console%20-%20Open%20All%20SSO%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/457921/AWS%20Console%20-%20Open%20All%20SSO%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intv = setInterval(function() {
        const collapsedButtons = document.querySelectorAll('button[aria-expanded="false"]');

        collapsedButtons.forEach(button => {
            button.click();
        });
    }, 100);
})();