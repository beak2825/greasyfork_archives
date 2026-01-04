// ==UserScript==
// @name        Dreamhost hide shopping cart 
// @namespace   english
// @description Dreamhost hide shopping cart - for some reason every page had a full page shopping cart at top
// @include     http*://*dreamhost.com*
// @version     1.1
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468149/Dreamhost%20hide%20shopping%20cart.user.js
// @updateURL https://update.greasyfork.org/scripts/468149/Dreamhost%20hide%20shopping%20cart.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '             .universalCheckoutLight{display:none;}                     ';
document.getElementsByTagName('head')[0].appendChild(style);



