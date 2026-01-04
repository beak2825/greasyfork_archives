// ==UserScript==
// @name         T3 Chat wide code block (expand on text-wrap)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Pure CSS rules to expand code blocks in in T3 Chat to fill horizontal space on wide screens to make reading long code blocks easier. (check comment for another version that always expands)
// @author       https://github.com/dicksonhk, https://t3.chat
// @license      MIT
// @match        https://beta.t3.chat/*
// @match        https://t3.chat/*
// @grant        GM_addStyle // Grant GM_addStyle for the first part
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537311/T3%20Chat%20wide%20code%20block%20%28expand%20on%20text-wrap%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537311/T3%20Chat%20wide%20code%20block%20%28expand%20on%20text-wrap%29.meta.js
// ==/UserScript==

// Always expand version: https://gist.github.com/dicksonhk/8b63c005a9ab8fa94ca82246f43b6724/raw/t3-chat-expand-codeblock--always-expand.user.js
// Combined version: https://gist.github.com/dicksonhk/8b63c005a9ab8fa94ca82246f43b6724/raw/t3-chat-expand-codeblock.user.js

(function () {
  'use strict';

  // The original max-width for the wrapper, needs to match chat wrapper ([role="log"])'s max-width
  const WRAPPER_MAX_WIDTH = '48rem';

  const CODEBLOCK_EXPANDED_WIDTH = 'fit-content';
  const CODEBLOCK_EXPANDED_MAX_WIDTH = '100%';
  const CODEBLOCK_EXPANDED_MIN_WIDTH = WRAPPER_MAX_WIDTH;


  const CUSTOM_CSS = `
/*
  Sets the width explicitly to make sure style is not broken
  in-case the chat wrapper max-width changes in the future.
*/
[role="log"] {
    max-width: ${WRAPPER_MAX_WIDTH};
}

/*
  Only activate when the messages wrapper is smaller than the viewport,
  the styles are designed to work without this guard but just to be safe.
 */
@media (min-width: ${WRAPPER_MAX_WIDTH}) {
    /*
      The selector [role="log"] [data-message-id]:not(.justify-end) .w-full [role="article"]
      only select responses that are full-width, as the calculations 
      assume the wrapper is full-width and would break otherwise.
    */

    /* Expand code blocks wrapper beyond its container */

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> * > .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
    {
        margin-left: min(0px, calc(-1 * (100vw - ${WRAPPER_MAX_WIDTH}) / 2));
        margin-right: min(0px, calc(-1 * (100vw - ${WRAPPER_MAX_WIDTH}) / 2));
    }

    /*
      Expand and center code blocks to fit available space, 
      while preventing it from shrinking.
    */

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
    {
        width: ${CODEBLOCK_EXPANDED_WIDTH} !important;
        max-width: min(100%, ${CODEBLOCK_EXPANDED_MAX_WIDTH});
        min-width: min(100vw, ${CODEBLOCK_EXPANDED_MIN_WIDTH});
        min-width: min(100cqw, ${CODEBLOCK_EXPANDED_MIN_WIDTH});
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /*
      Prevent the floating copy button being covered by overlay settings menu.
      (Have false positives but better than covered.)
    */

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
      > .sticky
    {
        top: 74px; /* comes from .max-900:top-[74px] */
    }

    /*
      The following two rules handles code block that are indented.
      By setting container-type on its immediate parent, 
      children can use 100cqw to calculate the extra space on the left.
      Otherwise the expanded code block will be shifted to the right 
      and go out of view.
    */

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"],
    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
     :has(> * > * > .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
    {
        container-type: inline-size;
        width: 100%;
    }

    [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      > * :has(> * > .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
    {
        margin-left: min(0px, calc(-1 * (100vw - 100cqw) / 2));
    }

    /* Take into account sidebar size when expanded */

    .group\\/sidebar-wrapper > [data-state="expanded"] ~ main 
      [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      :has(> * > .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
    {
        margin-left: min(0px, calc(-1 * ((100vw - var(--sidebar-width)) - ${WRAPPER_MAX_WIDTH}) / 2));
        margin-right: min(0px, calc(-1 * ((100vw - var(--sidebar-width)) - ${WRAPPER_MAX_WIDTH}) / 2));
    }

    /* Take into account sidebar size when expanded and block indented. */

    .group\\/sidebar-wrapper > [data-state="expanded"] ~ main
      [role="log"] [data-message-id]:not(.justify-end) > .w-full [role="article"]
      > * :has(> * > .\\[\\&_pre\\]\\:whitespace-pre-wrap > pre)
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
