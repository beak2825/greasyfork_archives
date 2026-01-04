// ==UserScript==
// @name         Panzoid 2016 Layout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply custom CSS to Panzoid to mimic a 2016 layout
// @author       Mason
// @match        https://www.panzoid.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507567/Panzoid%202016%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/507567/Panzoid%202016%20Layout.meta.js
// ==/UserScript==

// Add custom CSS
GM_addStyle(`
  /* Example custom styles for Panzoid */
  
  /* Make header background color change */
  .header {
    background-color: #333 !important;
  }

  /* Change font color for navigation links */
  .header-nav a {
    color: #ffcc00 !important;
  }

  /* Adjust content area styling */
  .content-left {
    background-color: #f4f4f4 !important;
  }

  /* Hide specific elements (example) */
  .adsbygoogle {
    display: none !important;
  }
`);
