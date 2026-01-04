// ==UserScript==
// @name         Fandom Focus
// @version      2.1.5
// @description  Restore Fandom to a clean, readable, and distraction-free layout.
// @icon         https://www.fandom.com/f2/assets/favicons/favicon.ico
// @author       samerop
// @license      MIT
// @match        https://*.fandom.com/*
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/1426714
// @downloadURL https://update.greasyfork.org/scripts/528895/Fandom%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/528895/Fandom%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customCss = `
        #global-explore-navigation,
        #onetrust-consent-sdk,
        .page__right-rail,
        .notifications-placeholder {
          display: none !important;
        }

        body.f2-page:not(.article-editor-body):not(.no-global-nav) {
            margin-left: 0 !important;
        }

        .main-container {
            margin-left: 0 !important;
            width: 100% !important;
        }

        .fandom-community-header__background.fullScreen {
            width: 100% !important;
        }

        .fandom-community-header__background.fitCenter {
            background-size: cover !important;
        }
    `;

    const style = document.createElement('style');
    style.textContent = customCss;
    document.documentElement.appendChild(style);
})();