// ==UserScript==
// @name           google_calendar_colorize_today
// @namespace      https://greasyfork.org/de/users/157797-lual
// @match          https://calendar.google.com/*
// @version        0.7
// @author         lual
// @description	   make the present day more visibile (in 2-weeks- & month view)
// @author         lual
// @grant          GM_addStyle
// @icon           data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%2300008F" stroke="%23000029" stroke-width="2" /> <text x="50" y="50" font-family="Arial, sans-serif" font-size="70" fill="%23FFFFFF" text-anchor="middle" dominant-baseline="central">31</text></svg>

// @downloadURL https://update.greasyfork.org/scripts/34991/google_calendar_colorize_today.user.js
// @updateURL https://update.greasyfork.org/scripts/34991/google_calendar_colorize_today.meta.js
// ==/UserScript==
// changes:        2017-11-10 initial
//                 2022-11-10 convert deprecated @include to @match
//                 2024-01-17 update the crazy css-class-names
//                 2024-11-20 update the crazy css-class-names
//                            (i'm not sure if google will keep these names for a longer period)
//                            if someone knows a better way, please tell me
////////////////////////////////////////////////////////////////////////////////
GM_addStyle(`
  /* today */

  /* OBSOLETE now broken...
  .ef2wWc {
    background-color: #BCD8E5 !important;
    background: linear-gradient(to bottom, #F5F5F5, #BCD8E5);
  }
  .SU7tYb.F262Ye {
    background-color: #BCD8E5 !important;
    background: linear-gradient(to top, #F5F5F5, #BCD8E5);
  }
  obsolete 2024-11-20...
  div.zYZlv:has(> h2.F262Ye) {
    background-color: #BCD8E5 !important;
    background: linear-gradient(to top, #F5F5F5, #BCD8E5);
  }
  */

  div:has(> h2.F262Ye) {
    background-color: #BCD8E5 !important;
    background: linear-gradient(to top, #F5F5F5, #BCD8E5);
  }
`);