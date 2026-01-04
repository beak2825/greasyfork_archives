// ==UserScript==
// @name        microsoft outlook website 365 blue unread emails dark mode 
// @namespace   english
// @description microsoft outlook website 365 blue unread emails dark mode +dark-loading-screen
// @include     http*://*outlook.office.com/mail*
// @include     http*://*outlook.office365.com*
// @version     1.14
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393527/microsoft%20outlook%20website%20365%20blue%20unread%20emails%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/393527/microsoft%20outlook%20website%20365%20blue%20unread%20emails%20dark%20mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '             html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS {     background-color: #11528a  !important ;} #loadingScreen {     background-color: #2b2b2b;}       ';
document.getElementsByTagName('head')[0].appendChild(style);