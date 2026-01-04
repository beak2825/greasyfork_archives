// ==UserScript==
// @name        TP NX - show logout button on small screens - title bar not as wide
// @namespace   english
// @description      TP NX - show logout button on small screens - title bar not as wide  2
// @include     http*://*tourplan.net*
// @version     1.1
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499708/TP%20NX%20-%20show%20logout%20button%20on%20small%20screens%20-%20title%20bar%20not%20as%20wide.user.js
// @updateURL https://update.greasyfork.org/scripts/499708/TP%20NX%20-%20show%20logout%20button%20on%20small%20screens%20-%20title%20bar%20not%20as%20wide.meta.js
// ==/UserScript==

// Main - CSS added to header 

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '         .ngview>div header>tp-label {     flex: initial  !important ;  }            ';
document.getElementsByTagName('head')[0].appendChild(style);





