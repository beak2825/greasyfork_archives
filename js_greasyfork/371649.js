// ==UserScript==
// @name        Facebook remove friends buttons/ links
// @namespace   english
// @description Facebook remove friends buttons/ links - work in progress
// @include     http*://*facebook.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371649/Facebook%20remove%20friends%20buttons%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/371649/Facebook%20remove%20friends%20buttons%20links.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '          ._zzz2s24 {/*\n*/     /*\n*/    display: none;/*\n*/}                 ';

document.getElementsByTagName('head')[0].appendChild(style);
