// ==UserScript==
// @name         T3 Chat wide code block (always expand)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Pure CSS rules to expand code blocks in T3 Chat to fill horizontal space on wide screens to make reading long code blocks easier. (check comment for another version that only expands when text-wrap is enabled)
// @author       https://github.com/dicksonhk, https://t3.chat
// @license      MIT
// @match        https://beta.t3.chat/*
// @match        https://t3.chat/*
// @grant        GM_addStyle // Grant GM_addStyle for the first part
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537314/T3%20Chat%20wide%20code%20block%20%28always%20expand%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537314/T3%20Chat%20wide%20code%20block%20%28always%20expand%29.meta.js
// ==/UserScript==

// Expands when text-wrap is enabled version: https://gist.github.com/dicksonhk/8b63c005a9ab8fa94ca82246f43b6724/raw/t3-chat-expand-codeblock--expand-on-wrap.user.js
// Combined version: https://gist.github.com/dicksonhk/8b63c005a9ab8fa94ca82246f43b6724/raw/t3-chat-expand-codeblock.user.js

(function () {
  'use strict';

  // The original max-width for the wrapper, needs to match chat wrapper ([role="log"])'s max-width
  const WRAPPER_MAX_WIDTH = '48rem';

  const CODEBLOCK_EXPANDED_WIDTH = 'fit-content';
  const CODEBLOCK_EXPANDED_MAX_WIDTH = '100%';
  const CODEBLOCK_EXPANDED_MIN_WIDTH = WRAPPER_MAX_WIDTH;


  const CUSTOM_CSS = `
@media (min-width: ${WRAPPER_MAX_WIDTH}) {
    [role="log"] {
        max-width: ${WRAPPER_MAX_WIDTH};
        container-type: inline-size;
        width: 100%;
    }
    
    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"] {
        container-type: inline-size;
        width: 100%;
    }

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
     :has(> * > * > * > pre)
    {
        container-type: inline-size;
    }

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> * > * > pre)
    {
        margin-left: min(0px, calc(-1 * (100vw - ${WRAPPER_MAX_WIDTH}) / 2));
        margin-right: min(0px, calc(-1 * (100vw - ${WRAPPER_MAX_WIDTH}) / 2));
    }

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      > * :has(> * > * > pre)
    {
        margin-left: min(0px, calc(-1 * (100vw - 100cqw) / 2));
    }

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> * > pre)
    {
        width: ${CODEBLOCK_EXPANDED_WIDTH} !important;
        max-width: min(100%, ${CODEBLOCK_EXPANDED_MAX_WIDTH});
        min-width: min(100vw, ${CODEBLOCK_EXPANDED_MIN_WIDTH});
        min-width: min(100cqw, ${CODEBLOCK_EXPANDED_MIN_WIDTH});
        margin-left: auto !important;
        margin-right: auto !important;
    }

    .group\\/sidebar-wrapper > [data-state="expanded"] ~ main 
      [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> * > * > pre)
    {
        margin-left: min(0px, calc(-1 * ((100vw - var(--sidebar-width)) - ${WRAPPER_MAX_WIDTH}) / 2));
        margin-right: min(0px, calc(-1 * ((100vw - var(--sidebar-width)) - ${WRAPPER_MAX_WIDTH}) / 2));
    }

    .group\\/sidebar-wrapper > [data-state="expanded"] ~ main
      [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      > * :has(> * > * > pre)
    {
        margin-left: min(0px, calc(-1 * ((100vw - var(--sidebar-width)) - 100cqw) / 2));
    }
}
`;

  injectCss(CUSTOM_CSS);

  // --- Function to add CSS, checking for GM_addStyle ---
  function injectCss(css) {
    // Check if GM_addStyle is available
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
      return;
    }

    // Inject using a style element
    const styleElement = document.createElement('style');
    styleElement.textContent = css;

    // Append to head if available
    if (document.head) {
      document.head.appendChild(styleElement);
      return;
    }

    // As a last resort, append to the document's root element
    // This is less ideal for performance but ensures the style is applied
    document.documentElement.appendChild(styleElement);
  }
})();
