// ==UserScript==
// @name        pka private - cpanel jb
// @namespace   english
// @description p_pr
// @include     http*://*vmcp02.stealth-servers.com.au*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38937/pka%20private%20-%20cpanel%20jb.user.js
// @updateURL https://update.greasyfork.org/scripts/38937/pka%20private%20-%20cpanel%20jb.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '         body#resourceusage{      color: #1f1f1f !important;    background-color: #d2d2d2 !important ;}       ';
document.getElementsByTagName('head')[0].appendChild(style);
