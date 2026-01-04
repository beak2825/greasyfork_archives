// ==UserScript==
// @name        TheWeek.com Remove Banner
// @namespace   Violentmonkey Scripts
// @match       https://theweek.com/*
// @grant       GM_addStyle
// @version     1.0.0
// @author      -
// @license     MIT
// @description 11/28/2023, 9:43:25 AM
// @downloadURL https://update.greasyfork.org/scripts/481116/TheWeekcom%20Remove%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/481116/TheWeekcom%20Remove%20Banner.meta.js
// ==/UserScript==

GM_addStyle ( `
.paywall-locker {
    height: 100% !important;
}
.kiosq-main-layer {
  display: none;
}
#blueconic-article-theweek {
  display: none;
}
` );