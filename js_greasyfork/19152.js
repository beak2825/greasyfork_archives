// ==UserScript==
// @name        Facebook grey minimalist 
// @namespace   english
// @description Grey subdued fb
// @include     http*://*facebook.com*
// @version     2.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/19152/Facebook%20grey%20minimalist.user.js
// @updateURL https://update.greasyfork.org/scripts/19152/Facebook%20grey%20minimalist.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header


var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML =  '                  body ._3_s1._3_s0 {/*\n*/    background-color: #7d7d7d;/*\n*/    color: #fff;/*\n*/}/*\n*//*\n*/body ._2s1x ._2s1y {/*\n*/    background-color: #c3c3c3;/*\n*/    border-bottom: 1px solid #777777;/*\n*/    color: #fff;/*\n*/}/*\n*//*\n*/body #pagelet_bluebar h1{display:none;}/*\n*//*\n*/body ._4jy1 {/*\n*/    background-color: #a7a7a7;/*\n*/    border-color: #656565;/*\n*/}/*\n*//*\n*//*\n*/body ._4jy1:hover {/*\n*/      background-color: #6d6d6d;/*\n*/    border-color: #383838;/*\n*/}/*\n*//*\n*/body a {/*\n*/    color: #236c90;/*\n*/    cursor: pointer;/*\n*/    text-decoration: none;/*\n*/}  ._585- {    background-color: #fff;    border: 1px solid #757575; }._5vb_, ._5vb_ #contentCol {    background-color: #eaeaea;    color: #2f2f2f;} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}                       ';

document.getElementsByTagName('head')[0].appendChild(style);


