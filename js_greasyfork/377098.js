// ==UserScript==
// @name        Gmail logo change to pka
// @namespace   english
// @description Gmail logo change to pka private
// @include     http*://*mail.google.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377098/Gmail%20logo%20change%20to%20pka.user.js
// @updateURL https://update.greasyfork.org/scripts/377098/Gmail%20logo%20change%20to%20pka.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header



 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '      .gb_uc.gb_0e .gb_Le.gb_vc.gb_2e img{display:none;}.gb_uc.gb_0e .gb_Le.gb_vc.gb_2e {width: 50px;background-image: url(https://pushka.com/p/wp-content/uploads/2019/01/index.png);background-repeat: no-repeat;background-size: 26px;background-position: right top;height: 26px;}      ';

document.getElementsByTagName('head')[0].appendChild(style);



