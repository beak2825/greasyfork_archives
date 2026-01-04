// ==UserScript==
// @name        Facebook - flip the colours into a dark mode - quick night theme
// @namespace   english
// @description Facebook - flip the colours into a dark mode - quick night theme - colour hue flip 
// @include     http*://*facebook.com*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371929/Facebook%20-%20flip%20the%20colours%20into%20a%20dark%20mode%20-%20quick%20night%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371929/Facebook%20-%20flip%20the%20colours%20into%20a%20dark%20mode%20-%20quick%20night%20theme.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        html{    filter: invert(85%)hue-rotate(180deg)grayscale(60%)contrast(120%);}          ';

document.getElementsByTagName('head')[0].appendChild(style);
