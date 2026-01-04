// ==UserScript==
// @name Streamline Newsroom NZ
// @namespace newsroom.co.nz
// @version 2.0.1
// @description Removes repeated sections and vertical whitespace from Newsroom.co.nz website.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.newsroom.co.nz/*
// @downloadURL https://update.greasyfork.org/scripts/428379/Streamline%20Newsroom%20NZ.user.js
// @updateURL https://update.greasyfork.org/scripts/428379/Streamline%20Newsroom%20NZ.meta.js
// ==/UserScript==

(function() {
let css = `
   @media only screen and (min-width: 782px) {
      .desktop-sidebar, .subpage-sidebar {
         background-color: #fff;
         max-width: 13em;
         padding: 0.5rem;
      }
   }
   .desktop-sidebar {
      background: #000;
   }
   .middle-header-contain .wrapper {
      padding: 0 !important;
   }
   @media (min-width: 782px) {
      .h-stk:not(.h-sub) .site-header .custom-logo {
         max-height: 45px;
         max-width: 250px;
      }
   }
   .site-content {
      margin-top: 0.8rem !important;
   }
   .newspack-post-subtitle {
      margin-bottom: 0.5em;
   }
   .category-premium {
      background-color: #fff1f1;
   }
   .mobile-sidebar {
      width: inherit;
   }

   hr {
      margin: 10px !important;
   }

   .entry {
      border-bottom: 4px solid red;
   }
   .above-footer-widgets {
      display: none;
   }
   .widget.widget_block {
      display: none;
   }

   #secondary,
   .singe #secondary {
      margin-top: 0rem;
      padding-top: 0 !important;
   }
   .h-stk.h-cl .site-header .middle-header-contain .wrapper > div.site-branding {
      width: initial;
   }

   .nav1 .main-menu > li > a {
      padding: 0rem 0.25rem;
      font-weight: 500;
   }
   .wpnbha.is-style-borders article {
      border: solid rgba(0, 0, 0, .2);
      border-top-width: medium;
      border-right-width: medium;
      border-bottom-width: medium;
      border-left-width: medium;
      border-width: 0 0 1px;
      box-sizing: content-box;
      padding-bottom: 0em;
   }
   .wpnbha article {
      min-width: 0;
      margin-bottom: 0.5em;
      word-break: break-word;
      overflow-wrap: break-word;
      position: relative;
   }
   :where(.wp-block-columns) {
      margin-bottom: 0em !important;
   }
   .homepage-top:first-of-type {
      display: none !important;
   }
   .site-content {
      margin-top: 0rem !important;
   }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
