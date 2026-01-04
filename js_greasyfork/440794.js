// ==UserScript==
// @name        google.com asking you to use chrome delete - ERROR
// @namespace   english
// @description google.com asking you to use chrome delete - nag
// @include     http*://*google.com*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440794/googlecom%20asking%20you%20to%20use%20chrome%20delete%20-%20ERROR.user.js
// @updateURL https://update.greasyfork.org/scripts/440794/googlecom%20asking%20you%20to%20use%20chrome%20delete%20-%20ERROR.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '      /* .gb_Td.gb_Va.gb_Id iframe:first-of-type{display:none  !important ;}    */       ';

document.getElementsByTagName('head')[0].appendChild(style);
