// ==UserScript==
// @name         glassdoor.com unpaywall
// @namespace    Violentmonkey Scripts
// @version      2024-12-29
// @description  Remove the glassdoor.com paywall
// @author       You
// @match        https://www.glassdoor.com/*
// @match        https://www.glassdoor.com.au/*
// @match        https://www.glassdoor.co.uk/*
// @match        https://www.glassdoor.ca/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glassdoor.com.au
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522202/glassdoorcom%20unpaywall.user.js
// @updateURL https://update.greasyfork.org/scripts/522202/glassdoorcom%20unpaywall.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    /* glassdoor.com, glassdoor.ca, ... */
    #HardsellOverlay {
      display: none !important;
    }
    /* glassdoor.com.au */
    #ContentWallHardsell {
      display: none !important;
    }
    body {
      overflow: auto !important;
      height: unset !important;
      /* .com */
      position: unset !important;
    }

  `)


  function removeOnScroll() {
    // wait for the hardsell-content-wall script to load which adds the window.onscroll handler
    // https://www.glassdoor.com.au/garnish/static/js/gd-hardsell-content-wall.bundle.js?v=bffab
    if (unsafeWindow.onscroll === null) {
      console.log('userscript: waiting for page to define window.onscroll')
      setTimeout(removeOnScroll, 100);
      return;
    } else {
      console.log('userscript: removing window.onscroll')
      unsafeWindow.onscroll = undefined;
    }
  }

  if (window.location.href.includes('glassdoor.com.au')) {
    removeOnScroll();
  }

})();

