// ==UserScript==
// @name        html editor strip down 
// @namespace   english
// @description html editor strip down  2
// @include     http*://*html5-editor.net*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380951/html%20editor%20strip%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/380951/html%20editor%20strip%20down.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');

style.type = 'text/css';style.innerHTML = '    body{height: 100%;overflow: hidden;}#sidebar, footer ,.mce-tooltip,.mce-menu,.toRead {display: none  !important ;}           ';
document.getElementsByTagName('head')[0].appendChild(style);

 