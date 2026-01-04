// ==UserScript==
// @name        WhatsApp Web Messages Website Dark Theme Night Mode
// @namespace   english
// @description WhatsApp Web Messages Website Dark Theme Night Mode Simple 
// @include     http*://*web.whatsapp.com*
// @version     2.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371606/WhatsApp%20Web%20Messages%20Website%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371606/WhatsApp%20Web%20Messages%20Website%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        ._11ozL {     filter: invert(1)brightness(0.8)contrast(3);}   body{filter: invert(1)contrast(0.75)hue-rotate(180deg);}img{filter: invert(1)contrast(1.25)hue-rotate(180deg);} html .NuujD {     zoom: 130%;}  body .landing-main {     background: #000;}       ';

document.getElementsByTagName('head')[0].appendChild(style);
