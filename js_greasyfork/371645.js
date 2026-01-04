// ==UserScript==
// @name        Multi Simple Website Dark Theme Night Mode - normal sites 
// @namespace   english
// @description Multi Website Dark Theme Night Mode Simple 
// @include     http*://*westpac.com.au*
// @include     http*://*ing.com.au*
// @include     http*://*ubank.com.au*
// @include     http*://*guerrillamail.com*
// @include     http*://*namecheap.com*
// @include     http*://*meetup.com*
// @include     http*://*brainyquote.com*
// @version     1.8
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371645/Multi%20Simple%20Website%20Dark%20Theme%20Night%20Mode%20-%20normal%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/371645/Multi%20Simple%20Website%20Dark%20Theme%20Night%20Mode%20-%20normal%20sites.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '        body{ filter: invert(100%)hue-rotate(180deg); } /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/} .ING-home-slider {     display: none;}     ';

document.getElementsByTagName('head')[0].appendChild(style);
