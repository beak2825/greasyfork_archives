// ==UserScript==
// @name        textmechanic.com remove patreon banner 
// @namespace   english
// @description textmechanic.com remove patreon banner and maybe more in the future
// @include     http*://*textmechanic.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16221/textmechaniccom%20remove%20patreon%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/16221/textmechaniccom%20remove%20patreon%20banner.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '           .patreon,.textwidget img{display:none;} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}         ';
document.getElementsByTagName('head')[0].appendChild(style);
