// ==UserScript==
// @name        google docs dark mode night theme 
// @namespace   english
// @description  google docs dark mode night theme 2
// @include     http*://*docs.google.com*
// @version     1.3
// @run-at document-end
// @license MIT 
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498442/google%20docs%20dark%20mode%20night%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/498442/google%20docs%20dark%20mode%20night%20theme.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '                   hml{filter: hue-rotate(180deg)invert(1) !important;}          ';

document.getElementsByTagName('head')[0].appendChild(style);
