// ==UserScript==
// @name           owa_calendar_colorize_today
// @namespace      https://greasyfork.org/de/users/157797-lual
// @include        https://mail.intern.tuwien.ac.at/owa*
// @version        0.3
// @author         lual
// @description	   make today more visibile
// @author         lual
// @grant          GM_addStyle
// @icon           data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23AAAA33" stroke="%23FFFF55" stroke-width="2" /> <text x="50" y="50" font-family="Arial, sans-serif" font-size="70" fill="%23FFFFFF" text-anchor="middle" dominant-baseline="central">31</text></svg>
// @downloadURL https://update.greasyfork.org/scripts/34993/owa_calendar_colorize_today.user.js
// @updateURL https://update.greasyfork.org/scripts/34993/owa_calendar_colorize_today.meta.js
// ==/UserScript==
// changes:        2017-11-10 initial
//                 2025-09-23 make it work again
////////////////////////////////////////////////////////////////////////////////
GM_addStyle(`
  /* today */
  .ms-border-color-themePrimary, .ms-bcl-tp, .ms-border-color-themePrimary-hover:hover, .ms-bcl-tp-h:hover {
    border-color: red !important;
    background-color: #FFFF00;
    background: linear-gradient(to top, #FFFFAA, #FFFF00);
}

.ms-font-color-themePrimary {
    /*background-color: yellow;*/
    background-color: #FFFF00 !important;
    background: linear-gradient(to top, #FFFFAA, #FFFF00);
}

/* now (time) */
/*
.ms-border-color-themeSecondary {
    background-color: yellow;
    background-color: #FFFF00 !important;
    background: linear-gradient(to top, #FFFFAA, #FFFF00);
}

.ms-bg-color-themeSecondary {
    background-color: yellow;
    background-color: #FFFF00 !important;
    background: linear-gradient(to top, #FFFFAA, #FFFF00);
}
*/
  /* now - time line */
._cb_s2 {
  border-bottom-width: 5px !important;
  border-bottom-style: dotted !important;
  border-bottom-color:  #0000FF80 !important;
  z-index: 100 !important;
`);