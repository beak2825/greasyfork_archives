// ==UserScript==
// @name        Kingdom Hearts Insider video game music Dark Mode
// @namespace   english
// @description  Kingdom Hearts Insider video game music - Dark Mode
// @include     http*://*khinsider.com*
// @version     1.2
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469820/Kingdom%20Hearts%20Insider%20video%20game%20music%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/469820/Kingdom%20Hearts%20Insider%20video%20game%20music%20Dark%20Mode.meta.js
// ==/UserScript==


// Main - redirect test 

//css color for added text - dark and light modes 

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '     html{filter: invert(1)hue-rotate(200deg);}img{filter: invert(1)hue-rotate(160deg);}#leftColumn a h1{display:none;}    ' ;

document.getElementsByTagName('head')[0].appendChild(style);

 

  