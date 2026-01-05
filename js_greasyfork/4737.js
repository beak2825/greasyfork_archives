// ==UserScript==
// @name        nu.nl
// @description stretching the content of my news site a bit
// @namespace   neemspees
// @include     http://www.nu.nl/*
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/4737/nunl.user.js
// @updateURL https://update.greasyfork.org/scripts/4737/nunl.meta.js
// ==/UserScript==

GM_addStyle('#pagewrapper                      { width:1300px !important;}');
GM_addStyle('#contentwrapper                   { width:1160px !important;}');
GM_addStyle('#contentwrapper #middlecolumn     { width:890px  !important;}');
GM_addStyle('#rightcolumn .content ul.top5 li  { width:218px  !important;}');
GM_addStyle('#contentwrapper #rightcolumn      { width:232px  !important;}');
