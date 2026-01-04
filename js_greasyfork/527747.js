// ==UserScript==
// @name        Clean AccuWeather
// @description Remove right column in two-column page content
// @namespace   shiftgeist
// @match       https://www.accuweather.com/*
// @grant       GM_addStyle
// @version     20250228
// @author      shiftgeist
// @license     GNU GPLv3
// @icon        https://www.accuweather.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/527747/Clean%20AccuWeather.user.js
// @updateURL https://update.greasyfork.org/scripts/527747/Clean%20AccuWeather.meta.js
// ==/UserScript==

GM_addStyle(`
  .two-column-page-content .page-column-1 {
    margin-left: 24px;
    width: 100% !important;
  }

  .two-column-page-content .page-column-2,
  .zone-centerWell1,
  .zone-centerWell2 {
    display: none;
  }
`);
