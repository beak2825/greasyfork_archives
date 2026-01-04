// ==UserScript==
// @name        larger message box in Google Script
// @namespace   english
// @description larger message box in Google Script - alert message 
// @include     http*://*script.google.com*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37714/larger%20message%20box%20in%20Google%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/37714/larger%20message%20box%20in%20Google%20Script.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '         /* \n */div.docs-butterbar-wrap{ font-size: 123%;font-family: "PT Mono"; /* \n */padding: 0;/* \n */top: -18px;/* \n */position: relative;/* \n */}/* \n *//* \n */.jfk-butterBar ,.jfk-butterBar-info ,.jfk-butterBar-shown/* \n */{padding: 1.8em 3.8em;}/* \n */  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}     ';
document.getElementsByTagName('head')[0].appendChild(style);
