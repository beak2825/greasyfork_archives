// ==UserScript==
// @name RSI Platform - Optimized
// @namespace https://greasyfork.org/en/users/1410028
// @version 1.1.3
// @description Optimizations for the RobertsSpaceIndustries.com Platform
// @author 3of9
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://robertsspaceindustries.com/*
// @downloadURL https://update.greasyfork.org/scripts/520512/RSI%20Platform%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/520512/RSI%20Platform%20-%20Optimized.meta.js
// ==/UserScript==

(function() {
let css = `
    * {
        --lobby-message-background-color: var(--subscription-fill-color);
        --lobby-message-border-color: var(--color-alert-unread);
        --lobby-message-text-color: var(--subscription-stroke-color);;
        --lobby-message-button-color: var(--subscription-stroke-color);
        
        scrollbar-width: thin;
        scrollbar-color: var(--color-primary-100) var(--color-primary-400);
    }

    #platform-bar-head {
        display: none;
    }

    .o-navigationBar__content {
        max-width: unset !important;
    }

    .message-item {
        padding-top: 6px;
        padding-bottom: 6px;
    }

    .sidebar-list .sidebar-item.community {
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .sidebar-list .sidebar-item {
        padding-top: 1px;
        padding-bottom: 1px;
    }

    .lobby-member-presences > .members-list .lobby-presence-item {
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .theme-dark .sidebar-list .sidebar-item.unread .column.content a {
        color: var(--color-alert-unread);
    }

    .message-item.highlighted {
        background: color-mix(in srgb, var(--color-alert-unread) 25%, transparent);
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
