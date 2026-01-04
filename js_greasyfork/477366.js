// ==UserScript==
// @name Patreon Reading UI
// @namespace http://ironbrain.io/
// @version 1.0
// @description An overhaul of the patreon UI focused on making text based posts better.
// @author Lati
// @license GNU
// @grant GM_addStyle
// @run-at document-start
// @match http://patreon.com/*
// @match https://patreon.com/*
// @match http://*.patreon.com/*
// @match https://*.patreon.com/*
// @downloadURL https://update.greasyfork.org/scripts/477366/Patreon%20Reading%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/477366/Patreon%20Reading%20UI.meta.js
// ==/UserScript==

(function() {
let css = `
    nav[aria-label="Member navigation"] > div:nth-child(3), /* show minimal user icon */
    button[data-tag="account-menu-toggle-full"] > div:nth-child(2), /* show minimal user icon */
    nav[aria-label="Member navigation"] > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(2) /* show minimal member divider */
    {
        display: block;
    }

    a[aria-label="Visit page"], /* hide blown up author icon */
    nav[aria-label="Member navigation"] > div:nth-child(4), /* hide expanded user icon */
    nav[aria-label="Member navigation"] > div:nth-child(2) > div > div:nth-child(2) > div > div:nth-child(1) /* hide expanded member divider */
    {
        display: none;
    }

    main[role="main"] { /* always show top bar */
    }

    button[data-tag="account-menu-toggle-full"] > div:nth-child(2) > div /* reduce user icon padding */
    {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
    }

    #main-app-navigation { /* minimize sidebar */
        width: 4.25rem;
    }

`;

let home_css = `
    #reactTarget .reactWrapper > div:not([data-focus-guard], [data-focus-lock-disabled]) { /* minimize sidebar */
        margin-left: 4.25rem;
    }

    main[role="main"] div { /* always show top bar */
        opacity: 100;
    }
`;

let post_css = `
    #reactTarget .reactWrapper > div >  div:not([data-focus-guard], [data-focus-lock-disabled]) { /* minimize sidebar */
        margin-left: 4.25rem;
    }

    main[role="main"] > div:nth-child(1) > div > div > div > div:nth-child(2) > div:nth-child(3) { /* increase post size */
        grid-template-columns: 1fr;
        margin: 0 4.25rem 0 4.25rem;
    }

    div[span="1"] { /* remove right sidepanel */
       display: none;
    }
`;

if (typeof GM_addStyle !== "undefined") {
  if (window.location.href === 'https://www.patreon.com/home') {
      css = css + home_css;
  } else if (/https:\/\/www\.patreon\.com\/posts\/.+/.test(window.location.href)) {
      css = css + post_css;
  }
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}


})();
