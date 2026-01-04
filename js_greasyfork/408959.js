// ==UserScript==
// @name Full Dark Side Discord Theme
// @namespace FullDarkDiscord
// @version 0.2
// @description A full dark theme for Discord
// @author Johnatan Dias
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/channels/*
// @downloadURL https://update.greasyfork.org/scripts/408959/Full%20Dark%20Side%20Discord%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/408959/Full%20Dark%20Side%20Discord%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
    .theme-dark {
      --color: black;
      --background-primary: var(--color);
      --background-secondary: var(--color);
      --background-secondary-alt: var(--color);
      --background-tertiary: var(--color);
      --background-accent: var(--color);
      --background-floating: var(--color);
      --background-mobile-primary: var(--color);
      --background-mobile-secondary: var(--color);
      --channeltextarea-background: var(--color);
    }

    code,
    div[class^='embedWrapper-'],
    div[class^='message-']:hover {
      background: var(--background-modifier-selected) !important;
    }

    div[class^='scroller-']::-webkit-scrollbar-track {
      background-color: transparent !important;
    }

    div[class^='peopleColumn-'] {
      background: var(--background-primary) !important;
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
