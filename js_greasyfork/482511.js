// ==UserScript==
// @name        No Animations
// @namespace   No Animations Script
// @version     1
// @description Clear all animations on websites
// @author      Me
// @match       *://*/*
// @license     MIT
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482511/No%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/482511/No%20Animations.meta.js
// ==/UserScript==
GM_addStyle(`
  * {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
    marquee-style: none !important;
    -webkit-tap-highlight-color: transparent;
  }

  *::before, *::after, *::hover, *::active {
    transition: none !important;
    animation: none !important;
  }

  input, textarea, button, select, div, a {
    -webkit-tap-highlight-color: transparent;
  }

  img[src^="https://i.ytimg.com/an_webp/"] {
    display: none !important;
  }

  .yt-thumb[src*="/hqdefault.jpg"] {
    display: initial !important;
  }
`);

