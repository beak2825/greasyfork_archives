// ==UserScript==
// @name        No Animations
// @namespace   No Animations Script
// @version     3.3
// @description Clear all animations on websites
// @author      Nameniok
// @match       *://*/*
// @license     MIT
// @grant       GM_addStyle
// @run-at      @document-start
// @downloadURL https://update.greasyfork.org/scripts/475610/No%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/475610/No%20Animations.meta.js
// ==/UserScript==

GM_addStyle(`
  * {
    transition: none !important;
    transition-property: none !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    transition-timing-function: initial !important;
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    animation-delay: none !important;
    animation-duration: none !important;
    -webkit-animation-delay: 0 !important;
    -webkit-animation-duration: 0 !important;
    -moz-animation-delay: 0 !important;
    -moz-animation-duration: 0 !important;
    -o-animation-delay: 0 !important;
    -o-animation-duration: 0 !important;
    scroll-behavior: auto !important;
    marquee-style: none !important;
    -moz-scroll-behavior: auto !important;
    -moz-marquee-style: none !important;
  }

  *::before, *::after, *::hover, *::active {
    transition: none !important;
    transition-property: none !important;
    transition-duration: 0s !important;
    transition-timing-function: initial !important;
    -webkit-transition: none !important;
    animation-delay: none !important;
    animation-duration: none !important;
    -webkit-animation-delay: 0 !important;
    -webkit-animation-duration: 0 !important;
    -moz-animation-delay: 0 !important;
    -moz-animation-duration: 0 !important;
  }

  *:before, *:after, *:hover, *:active {
    transition: none !important;
    transition-property: none !important;
    transition-duration: 0s !important;
    transition-timing-function: initial !important;
    -webkit-transition: none !important;
    animation-delay: none !important;
    animation-duration: none !important;
    -webkit-animation-delay: 0 !important;
    -webkit-animation-duration: 0 !important;
    -moz-animation-delay: 0 !important;
    -moz-animation-duration: 0 !important;
  }

  input, textarea, button, select, div, a {
    -webkit-tap-highlight-color: transparent;
  }

  img[src^="https://i.ytimg.com/an_webp/"] {
    display: none !important;
  }

  img[src*="/hqdefault.jpg"] {
    display: initial !important;
  }
`);