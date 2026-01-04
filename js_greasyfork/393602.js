// ==UserScript==
// @name        Microsoft outlook 365 blue unread emails dark mode 
// @namespace   english
// @description Microsoft outlook 365 blue unread emails dark mode +dark-loading-screen
// @include     http*://*outlook.office.com/mail*
// @include     http*://*outlook.office365.com*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393602/Microsoft%20outlook%20365%20blue%20unread%20emails%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/393602/Microsoft%20outlook%20365%20blue%20unread%20emails%20dark%20mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '             html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS {     background-color: #11528a  !important ; } #loadingScreen {     background-color: #2b2b2b;}  /*\n*//*\n*/   html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS ._3zJzxRam-s-FYVZNqcZ0BW , html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS .ggucHldzYouSPjkewTdAT {color:#fff !important ;}   html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS ._2mXnm2n6WGzdKWTbrXEerf ,   html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS ._33kDu8YhkrBqlQy3HACYoN , html[dir=ltr] ._1E-ojjaYGhOxCgHp9Pe315.WHHpfJX04sHbd6jCFcPxS .RpYbr9-Ffvgs-N9NGXb3x {    color: #54d0ec  !important ; }    ';
document.getElementsByTagName('head')[0].appendChild(style);