// ==UserScript==
// @name        Gmail logo change to jtb 
// @namespace   english
// @description Gmail logo change to jtb  private
// @include     http*://*mail.google.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377097/Gmail%20logo%20change%20to%20jtb.user.js
// @updateURL https://update.greasyfork.org/scripts/377097/Gmail%20logo%20change%20to%20jtb.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header



 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '       .gb_uc.gb_0e .gb_Le.gb_vc.gb_2e img{display:none;}.gb_uc.gb_0e .gb_Le.gb_vc.gb_2e { background-position: right top;height:26px;width: 90px;background-image:url(https://www.jtbtravel.com.au/wp-content/uploads/2019/01/jtb-188-red-tiny-icon.png);background-repeat:no-repeat;}       ';

document.getElementsByTagName('head')[0].appendChild(style);



