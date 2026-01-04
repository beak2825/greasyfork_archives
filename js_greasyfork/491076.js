// ==UserScript==
// @name         Auto Continue SSO
// @namespace    http://vercel.com
// @version      0.0.1
// @description  Takes you straight to SSO login
// @author       ecklf
// @match        https://github.com/*
// @icon         https://github.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491076/Auto%20Continue%20SSO.user.js
// @updateURL https://update.greasyfork.org/scripts/491076/Auto%20Continue%20SSO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector(".org-sso") !== null) {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.trim() === 'Continue') {
                button.click();
            }
        });
    }
})();