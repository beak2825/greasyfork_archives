// ==UserScript==
// @name        Youtube - Slim Header
// @namespace   Youtube - Slim Header
// @include     https://www.youtube.com*
// @author      harumna
// @description Reduces YT header (searchbar, ...) height. For new 2017 YT design.
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33438/Youtube%20-%20Slim%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/33438/Youtube%20-%20Slim%20Header.meta.js
// ==/UserScript==

GM_addStyle("#container.ytd-masthead {height: 36px !important;}")
GM_addStyle("#page-manager {margin-top: 36px !important;}")