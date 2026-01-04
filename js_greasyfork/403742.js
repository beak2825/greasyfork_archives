// ==UserScript==
// @name         Tampermonkey Google Drive sync fix [adopted]
// @namespace    https://github.com/Tampermonkey/tampermonkey/issues/904
// @version      0.1.3
// @description  Tampermonkey keeps asking us to select an account when we open the browser.  But this script by Jack'lul will do it for us!
// @author       jacklul <jacklul.github.io>
// @license      ISC
// @match        https://accounts.google.com/signin/oauth*tampermonkey*
// @match        https://accounts.google.com/o/oauth2/v2/auth*tampermonkey*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403742/Tampermonkey%20Google%20Drive%20sync%20fix%20%5Badopted%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/403742/Tampermonkey%20Google%20Drive%20sync%20fix%20%5Badopted%5D.meta.js
// ==/UserScript==

// Now I am getting a new login screen without it saying specifically that it needs it for Tampermonkey :-/ (This must have been late 2020 or more likely early 2021)
// On 2021/05/11 Google sent me to this URL, but when I closed it, it actually went back to using the old one, so I guess this isn't necessary for now.
// @DO-NOT-YET-match        https://accounts.google.com/AccountChooser?oauth=1&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Flegacy%2Fconsent%3Fauthuser*

(function() {
    'use strict';

    let tryClick = setInterval(function() {
        const el =
              // Original
              document.querySelector('div[data-authuser="0"] #profileIdentifier')
              // New
              || document.querySelector('div[data-authuser="0"]')
        ;

        if (el) {
            const isBusy = document.querySelector('div[role="presentation"][tabindex="-1"]');
            const hasBackButton = document.querySelector('div[role="button"]#next');

            if (isBusy) {
                console.log('Page is busy...');
            }

            // Close page if there was "unknown error"
            if (hasBackButton) {
                window.close();
            }

            // Try clicking until page gets busy
            if (!isBusy) {
                console.log('Clicking...');
                el.click();
            }
        }
    }, 500);
})();
