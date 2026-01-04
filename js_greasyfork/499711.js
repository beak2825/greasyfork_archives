// ==UserScript==
// @name        Reddit new look compact list 
// @namespace   english
// @description  Reddit new look theme compact list 2024
// @include     http*://*reddit.com*
// @version     1.1
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/499711/Reddit%20new%20look%20compact%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/499711/Reddit%20new%20look%20compact%20list.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        .p-md {   padding: 2px  !important ; }  .mb-xs {   margin-bottom: 0  !important ; }       ';

document.getElementsByTagName('head')[0].appendChild(style);
