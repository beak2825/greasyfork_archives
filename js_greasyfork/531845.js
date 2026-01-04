// ==UserScript==
// @name         Kavita Margins + Incognito Redirect
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adjusts paginate widths and panel heights and forces Incognito read on kavita.partsdetour.com
// @match        https://kavita.partsdetour.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531845/Kavita%20Margins%20%2B%20Incognito%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/531845/Kavita%20Margins%20%2B%20Incognito%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style adjustments
    GM_addStyle(`
        .right[_ngcontent-ng-c1830646293],
        .left[_ngcontent-ng-c1830646293] {
            width: 50vw !important;
        }

        .pagination-area[_ngcontent-ng-c1619359725] .right[_ngcontent-ng-c1619359725] {
            width: 55% !important;
        }

        .pagination-area[_ngcontent-ng-c1619359725] .left[_ngcontent-ng-c1619359725] {
            width: 20% !important;
        }

        .right.ng-tns-c1619359725-1[_ngcontent-ng-c1619359725],
        .left.ng-tns-c1619359725-1[_ngcontent-ng-c1619359725] {
            height: 80dvh !important;
            max-height: 80dvh !important;
        }
    `);

    // Remove toast notifications
    const removeToast = () => {
        const toast = document.getElementById('toast-container');
        if (toast) toast.remove();
    };

    removeToast();
    const observer = new MutationObserver(removeToast);
    observer.observe(document.body, { childList: true, subtree: true });

    // Intercept Read button and trigger Incognito Read
    const interceptReadButton = () => {
        const readBtn = [...document.querySelectorAll('button')].find(btn =>
            btn.textContent.trim() === "Read"
        );
        const incognitoBtn = [...document.querySelectorAll('button')].find(btn =>
            btn.textContent.trim() === "Read Incognito"
        );

        if (readBtn && incognitoBtn) {
            readBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
                incognitoBtn.click();
            }, true);
        }
    };

    // Wait for buttons to appear
    const btnObserver = new MutationObserver(interceptReadButton);
    btnObserver.observe(document.body, { childList: true, subtree: true });
    interceptReadButton(); // Also run once immediately
})();