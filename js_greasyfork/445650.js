// ==UserScript==
// @name        Twitter Remove Content Warning
// @namespace   https://twitter.com
// @version     0.1
// @description Removes the content warning "Sensitive Material" on Twitter and unhides the content
// @icon        https://raw.githubusercontent.com/Ede123/userscripts/master/icons/Twitter.png
// @author      Eduard Braun <eduard.braun2@gmx.de>
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @include     https://twitter.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445650/Twitter%20Remove%20Content%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/445650/Twitter%20Remove%20Content%20Warning.meta.js
// ==/UserScript==

GM_addStyle('.r-yfv4eo{filter:unset!important} .css-1dbjc4n.r-drfeu3.r-1867qdf.r-1p0dtai.r-eqz5dr.r-16y2uox.r-1777fci.r-1d2f490.r-ymttw5.r-1f1sjgu.r-u8s1d.r-zchlnj.r-ipm5af{display:none}');
