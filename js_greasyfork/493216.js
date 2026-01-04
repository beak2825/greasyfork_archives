// ==UserScript==
// @name        remove discord images
// @namespace   english
// @description  remove discord images 2
// @include     http*://*discord.com*
// @version     1.0
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493216/remove%20discord%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/493216/remove%20discord%20images.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '          img {  display: none !important;}          ';

document.getElementsByTagName('head')[0].appendChild(style);
