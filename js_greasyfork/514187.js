// ==UserScript==
// @name        Nursebuddy - Remove Padding
// @description Modifies padding and height on nurseBuddy.fi, primarily intended for the visit/schedule page though it also changes the client & carer calendar sizes and padding/transition effects globally
// @version     1.6
// @author      TomC
// @match       https://app.nursebuddy.fi/*
// @grant       GM_addStyle
// @license     MIT
// @namespace https://greasyfork.org/users/441
// @downloadURL https://update.greasyfork.org/scripts/514187/Nursebuddy%20-%20Remove%20Padding.user.js
// @updateURL https://update.greasyfork.org/scripts/514187/Nursebuddy%20-%20Remove%20Padding.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        *,
        *::before,
        *::after {
            transition: none !important;
        }

        .contentDefaultPaddingBottom { padding-bottom: 0 !important; }
        .panel-heading { padding: 6px !important; }
        body.manager #shellContent { padding-left: 0 !important; padding-right: 0 !important; padding-top: 0 !important; }

        body.manager #mainContentContainer #breadCrumbAndContentContainer #topMenuBarContainer { height: 40px !important; min-height: 40px !important; }
        body.manager #mainContentContainer #breadCrumbAndContentContainer #breadCrumbs .breadCrumbsContainer { height: 40px !important; min-height: 40px !important; }
        [class*="MuiToolbar-regular-_react-injected-view-topMenuBarContainer-"] { height: 40px !important; min-height: 40px !important; }

        body.manager #menuContentSplitter #toggleMenu, body.manager #menuContentSplitter .toggleMenu { visibility: visible !important; opacity: 1 !important; }
        body.manager #menuContentSplitter #toggleMenu.show, body.manager #menuContentSplitter .toggleMenu.show { visibility: visible !important; opacity: 1 !important; }

        .intercom-lightweight-app-launcher { bottom: 50px !important; }
    `);

    adjustStyles();

})();

