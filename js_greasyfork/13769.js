// ==UserScript==
// @name        TFTV forum buttons
// @namespace   deetr
// @description Gets rid of news, streams, etc buttons at the top of tftv
// @include     /^(http)?s?:\/\/(www)?\.teamfortress\.tv.*$/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13769/TFTV%20forum%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/13769/TFTV%20forum%20buttons.meta.js
// ==/UserScript==
$(".mod-last[href*='streams'],.mod-last[href*='galleries'],.mod-last[href*='news'],.mod-last[href*='schedule']").hide();
$(".header-nav-item-wrapper[href*='threads']").width(260).css('text-align', 'center');
$(".header-nav-item-wrapper[href*='servers']").width(260).css('text-align', 'center');