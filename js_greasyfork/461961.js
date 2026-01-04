// ==UserScript==
// @license      GNU GPLv3
// @name         UKVAC CSS Fixes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Turn UKVAC back
// @author       rogalian
// @match        https://www.ukvac.com/forum/*
// @icon         https://www.ukvac.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/461961/UKVAC%20CSS%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/461961/UKVAC%20CSS%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle (`
      .p-header { max-width: unset !important; }
      .p-header-inner { max-width: unset !important; }
      .p-nav { max-width: unset !important; }
      .p-navSticky { max-width: unset !important; }
      .p-nav-inner { max-width: unset !important; }
      .p-sectionLinks { max-width: unset !important; }
      .p-sectionLinks-inner { max-width: unset !important; }
      .menu-footer { display: none !important; }
      .userBanner { display: none !important; }
      .js-reactionsList { display: none !important; }
      .p-body { max-width:  }
      .p-body-inner { max-width: unset !important; }
      .p-body-sidebarCol { display: none !important; }
      .p-body-sidebar { display: none !important; }
      .p-footer { max-width: unset !important; }
      .p-footer-inner { max-width: unset !important; }
      .reaction { display: none !important; }
      .ratingStarsRow { display: none !important; }
      .bratr-rating { display: none !important; }
      .shareButtons { display: none !important; }
      .message-attribution-gadget { display: none !important; }
      .message-userExtras { display: none !important; }
      .reactionsBar { display: none !important; }
      .p-navgroup-link--dbtech-credits { display: none !important; }
      .p-navgroup-link--dbtech-donate { display: none !important; }
      .p-navgroup-link--alerts { display: none !important; }
      .p-footer-copyright { display: none !important; }
`);
})();