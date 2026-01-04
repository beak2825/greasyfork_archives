// ==UserScript==
// @name        Text Mechanic Dark Night Mode Theme 
// @namespace   english
// @description Text Mechanic Dark Night Mode Theme - currently undergoing build
// @include     http*://*textmechanic.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371643/Text%20Mechanic%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371643/Text%20Mechanic%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                              body, html, html body {/*\n*/    background: #545454 !important;/*\n*/    background-color: #545454 !important;/*\n*/    background-image: none important;    color: #e4e4e4;/*\n*/}.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {/*\n*/    /*\n*/   /*\n*/    color: #e4e4e4;/*\n*/}textarea {/*\n*/    border: 1px solid #505050;    box-shadow: inset 0 0 6px #525252d6;/*\n*/    background-color: #bfbfbf;}/*\n*//*\n*//*\n*/ /*\n*/td, th {/*\n*/    border: 1px solid #f2f2f200;/*\n*/   /*\n*/}                        ';
document.getElementsByTagName('head')[0].appendChild(style);



