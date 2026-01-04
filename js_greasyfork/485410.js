// ==UserScript==
// @name        Reddit remove website logo
// @namespace   english
// @description Reddit remove website logo in header 
// @include     http*://*reddit.com*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485410/Reddit%20remove%20website%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/485410/Reddit%20remove%20website%20logo.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 
 

var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '         html header a svg,   html header a path     {display: none  !important  ;}     ';



document.getElementsByTagName('head')[0].appendChild(style);

 