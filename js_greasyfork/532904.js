// ==UserScript==
// @name Discord No Title Bar
// @namespace discord-no-title-bar
// @version 1.1.1
// @description A simple userstyle that removes Discord's new title bar.
// @author Coxxs
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/532904/Discord%20No%20Title%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/532904/Discord%20No%20Title%20Bar.meta.js
// ==/UserScript==

(function() {
let css = `

/***** Long class names *****/

/* Remove top bar */
.visual-refresh { --custom-app-top-bar-height: 0px }
.visual-refresh .c38106a3f0c3ca76-title { visibility: hidden }

/* Preserve inbox button */
.visual-refresh .c38106a3f0c3ca76-trailing { position: absolute; top: 12px; right: 10px; z-index: 101 }
.visual-refresh.density-compact .c38106a3f0c3ca76-trailing { top: 10px }
.visual-refresh.density-cozy .c38106a3f0c3ca76-trailing { top: 13px }

/* Provide some space for the inbox */
.visual-refresh ._9293f6b2fc12398a-toolbar { padding-right: 40px }
.visual-refresh ._1ac1c54c56e5807c-search { margin-right: 35px }

/* Padding above the Discord icon (top left) */
.visual-refresh ._1f388bcaa446c0c8-tutorialContainer { padding-top: 8px }

/* Remove help button */
.visual-refresh .c38106a3f0c3ca76-trailing > a.edefb8e22d63c542-anchorUnderlineOnHover { display: none }

/* Remove buttons other than inbox */
.visual-refresh .c38106a3f0c3ca76-trailing > div[aria-label] { display: none }
.visual-refresh .c38106a3f0c3ca76-trailing > div.c99c29809d200a61-clickable { display: flex }

/* Remove rounded corner and top border */
.visual-refresh ._5e434347c823b592-sidebarListRounded { border-top-left-radius: 0 !important; border-top: none !important } /* 2025-12-17 */
.visual-refresh .f75fb00fb7356cbe-chat[data-has-border=true] { border-top: none !important }
.visual-refresh ._133bf5eea8e33a34-container, /* Friends */
.visual-refresh .f391e3680aff100a-container, /* Message Requests */
.visual-refresh ._01ae244280823725-container,  /* Message Requests - Messages */
.visual-refresh ._0920e02cc8fc7b7b-homeWrapper, /* Nitro */
.visual-refresh ._6db1d32c47b6ad72-shop, /* Shop */
.visual-refresh .a592e1970a0ce22c-container, /* Discover */
.visual-refresh ._955a392354a35c6e-container, /* Quests */
.visual-refresh ._9293f6b2fc12398a-container /* Browse Channels */
    { border-top: none !important }
    
/***** Long class names END *****/

/***** Short class names *****/

/* Remove top bar */
.visual-refresh { --custom-app-top-bar-height: 0px }
.visual-refresh .title__85643 { visibility: hidden }

/* Preserve inbox button */
.visual-refresh .trailing_c38106 { position: absolute; top: 12px; right: 10px; z-index: 101 }
.visual-refresh.density-compact .trailing_c38106 { top: 10px }
.visual-refresh.density-cozy .trailing_c38106 { top: 13px }

/* Provide some space for the inbox */
.visual-refresh .toolbar__9293f { padding-right: 40px }
.visual-refresh .searchBar__1ac1c { margin-right: 35px }

/* Padding above the Discord icon (top left) */
.visual-refresh .tutorialContainer__1f388 { padding-top: 8px }

/* Remove help button */
.visual-refresh .trailing_c38106 > a.anchorUnderlineOnHover_edefb8 { display: none }

/* Remove buttons other than inbox */
.visual-refresh .trailing_c38106 > div[aria-label] { display: none }
.visual-refresh .trailing_c38106 > div.clickable_c99c29 { display: flex }

/* Remove rounded corner and top border */
.visual-refresh .sidebarListRounded_c48ade { border-top-left-radius: 0 !important; border-top: none !important } /* 2025-04-15 */
.visual-refresh .sidebarListRounded__5e434 { border-top-left-radius: 0 !important; border-top: none !important } /* 2025-11-13 */
.visual-refresh .chat_f75fb0[data-has-border=true] { border-top: none !important }
.visual-refresh .container__133bf, /* Friends */
.visual-refresh .container_f391e3, /* Message Requests */
.visual-refresh .container__01ae2,  /* Message Requests - Messages */
.visual-refresh .homeWrapper__0920e, /* Nitro */
.visual-refresh .shop__6db1d, /* Shop */
.visual-refresh .container_a592e1, /* Discover */
.visual-refresh .container__955a3, /* Quests */
.visual-refresh .container__9293f /* Browse Channels */
    { border-top: none !important }

/***** Short class names END *****/

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
