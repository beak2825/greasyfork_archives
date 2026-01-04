// ==UserScript==
// @name Opinionated crates.io Dark Theme
// @namespace griffi-gh
// @version 0.6.2
// @description Dark Theme for crates.io
// @author griffi-gh
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.crates.io/*
// @include /^(?:.*crates\.io\/crates\/.*\/versions)$/
// @downloadURL https://update.greasyfork.org/scripts/481715/Opinionated%20cratesio%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/481715/Opinionated%20cratesio%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "crates.io" || location.hostname.endsWith(".crates.io"))) {
  css += `
      :root {
          --main-bg: #2c3333;
          --main-bg-dark: #1c2323;
          --main-bg-light: #5d6353;
          --main-color: white;
          --header-bg-color: #000502;
          --footer-bg-color: #000904;
          --crate-color: #000904;
      }

      html, body {
          background-color: var(--main-bg);
      }

      head {
          background-color: var(--header-bg-color);
      }

      li > * {
          background-color: var(--main-bg-dark)!important;
          color: var(--main-color)!important;
      }

      input[name="q"] {
          background-color: var(--main-bg-dark);
          color: var(--main-color);
      }

      *[class*="docs"],*[class*="_inner-main_"] > *[class*="_list_"] {
          background-color: var(--main-bg-dark);
      }
      
      /* Dark mode in code blocks */
      code, pre {
          background-color: var(--main-bg-dark)!important;
          color: var(--main-color)!important;
      }
      
      /* code blocks: Fix unreadable strings and attrs */
      code .hljs-string {
          color: #f1ed69 !important;
      }
      code .hljs-attr {
          color: lightblue !important;
      }
      
      /* Fix copy button background on hover */
      *[class*="_copy-button"]:hover {
          background: var(--main-bg-light) !important;
      }
      
      /* Increase max width (from 900px to 1100px) */
      *[class*="_width-limit"] {
          width: 1100px !important;
      }
      @media only screen and (max-width: 1100px) {
          *[class*="_width-limit"] {
              width: 100% !important;
          }
      }
      
      /* Hacky navbar styling */
      *[class*="_nav"] {
          margin-bottom: 0 !important;
          z-index: 9999 !important;
          /* Required for sticky to look right*/
          background: var(--main-bg) !important;
          /* Make nav sticky */
          position: sticky !important;
          top: 0 !important;
      }
      *[class*="_docs"] {
          border-radius: 0 0 9px 9px !important;
      }
      *[class*="_list"] {
          --nav-tabs-border-width: 3px;
      }
      *[class*="_list"],*[class*="_link"] {
          border-bottom: var(--nav-tabs-border-width) solid var(--gray-border) !important;
      }
      *[class*="_link"] {
          margin-right: 4px !important;
          margin-bottom: calc(1px - var(--nav-tabs-border-width)) !important;
          color: lightgray !important;
      }
      *[class*="_link"][class*="_active"] {
          border-bottom: var(--nav-tabs-border-width) solid var(--link-color) !important;
          color: white !important;
      }
      
      /* Fix error message */
      body > p {
          color: var(--main-color);
      }
      
      /* Make stat lines a bit more subtle */
      *[class*="_stat"] {
          border-left-color: var(--main-bg-light) !important;
      }
      
      /* Remove line to the left of the first stat*/
      *[class*="_stats"] h3 + *[class*="_stat"] {
          border-left: none !important;
      }
      
      /* Put notifications on top */
      .ember-cli-notifications-notification__container {
          z-index: 999999 !important;
      }
      
      /* Fix /me page */
      *[class*="_token-list"] > * {
          background: var(--main-bg-dark) !important;
      }
      
      
      /* Fix dashboard */
      *[class*="_token-display"] {
          background: var(--main-bg) !important;
      }
      
      *[class*="_feed"], *[class*="_load-more"] * {
          background: var(--main-bg-dark) !important;
      }

      /* Fix "add owner" menu */
      *[class*="_email-form"] {
          background: var(--main-bg-dark) !important;
      }
      
      /*Make pagination more obvious */
      *[class*="_pagination_"] > ol > li > a {
          transition: all .15s !important;
          border-radius: 3px !important;
      }
      *[class*="_pagination_"] > ol > li > a.active {
          background: var(--main-bg-light) !important;
      }
      *[class*="_pagination_"] > ol > li > a:not(.active):not(:hover) {
          border-radius: 7px !important;
      }
      *[class*="_pagination_"] > ol > li > a:not(.active):hover {
          background: var(--main-bg-light) !important;
      }
      /* fix arrows color*/
      *[class*="_pagination_"] > a svg circle {
          fill: var(--main-bg-dark) !important;
      }

      /* make icons consistent and a slight shadow to them */
      svg[class*="_download-icon"] circle {
          fill: transparent !important;
      }
      *[class*="_updated-at_"] svg, svg[class*="_download-icon"] {
          filter: drop-shadow(0px 0px 3px var(--main-bg-light));
      }
      
      /* Invert crate version color */
      *[class*="_range-lg_"] {
          color: white !important;
      }
      
      /* Fix header and dropdown z-index */
      header[class*="_header_"], *[class*="_dropdown_"] {
          z-index: 999998 !important;
      }
      
      /*Remove ugly header shadow*/
      #cargo-desktop-search, [class*="_main_"] {
          box-shadow: none !important;
      }
      
      .tooltip.ember-tooltip {
          z-index: 999999 !important;
      }
  `;
}
if (new RegExp("^(?:.*crates\\.io\\/crates\\/.*\\/versions)\$").test(location.href)) {
  css += `
      *[class*="_nav"] {
  /*         z-index: unset !important;    */
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
