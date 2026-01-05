// ==UserScript==
// @name        Amazon hide recommendations
// @description Tries to hide recommendations on every page. Might block too much sometimes so if the site seems broken you might temporarily disable this script.
// @namespace   www.amazon.de
// @include     https://www.amazon.*
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28399/Amazon%20hide%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/28399/Amazon%20hide%20recommendations.meta.js
// ==/UserScript==

//second rule neded because it sometimes does not work without it WTF
GM_addStyle(
"#bia_content, #bia-hcb-widget, #nav-flyout-yourAccount .nav-flyout-sidePanel, #desktop-1, #desktop-2, #sc-rec-bottom, #sc-rec-right, #rhf, #desktop-typ-recs-1Shvl, div[data-widgetname^=desktop-typ-recs-]:\
{display:none !important;}\
#bia_content, #bia-hcb-widget,  #nav-flyout-yourAccount .nav-flyout-sidePanel, #desktop-1, #desktop-2, #sc-rec-bottom, #sc-rec-right,  #rhf, #desktop-typ-recs-1Shvl, div[data-widgetname^=desktop-typ-recs-] {color:red;display:none !important;}\
");