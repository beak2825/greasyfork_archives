// ==UserScript==
// @name        Fextralife Fixes
// @namespace   fextralifefixes
// @description Attempts to make Fextralife wikis more usable.  Hides the sidebar, comments, floating footer, and discord link.  Also increases the width of the wiki content to use the space that the sidebar was using and removes the minimum height so there isn't empty space at the bottom of a short article.
// @include     http://*.fextralife.com*
// @include     https://*.fextralife.com*
// @grant       GM_addStyle
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/428918/Fextralife%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/428918/Fextralife%20Fixes.meta.js
// ==/UserScript==
GM_addStyle(`
  .fex-main {
    min-height: 0px;
    }
  #wrapper {
    padding-left: 0px;
    transition: none;
    }
  #sidebar-wrapper {
    display: none;
    }
  .container-comments {
    display: none;
    }
  .sliderload {
    display: none;
    }
  .discussion-wrapper {
    display: none;
    }
  #btnComments {
    display: none;
    }
  .footer-sticky {
    display: none;
    }
  .hidden-xs {
    display: none;
    }
`);