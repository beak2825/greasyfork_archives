// ==UserScript==
// @name        Multi Simple Website Dark Theme Night Mode - light sites 
// @namespace   english
// @description Multi Website Dark Theme Night Mode Simple 
// @include     http*://*telstra.com*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371644/Multi%20Simple%20Website%20Dark%20Theme%20Night%20Mode%20-%20light%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/371644/Multi%20Simple%20Website%20Dark%20Theme%20Night%20Mode%20-%20light%20sites.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '         body {     filter:invert(100%)hue-rotate(180deg)brightness(130%)contrast(83%)saturate(90%); } /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}       ';

document.getElementsByTagName('head')[0].appendChild(style);
