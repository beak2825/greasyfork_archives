// ==UserScript==
// @name        Greasy Fork Dark Mode Night Theme
// @namespace   english
// @description Greasy Fork Dark Mode Night Theme - simple grey red
// @include     http*://*greasyfork.org*
// @version     2.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371270/Greasy%20Fork%20Dark%20Mode%20Night%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371270/Greasy%20Fork%20Dark%20Mode%20Night%20Theme.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '       #main-header {/*\n*/    background-image: linear-gradient(#000000, #343434) !important;/*\n*/}body { /*\n*/    background-color: #5a5a5a;/*\n*/}/*\n*/.script-list, .user-list, .text-content, .discussion-list {/*\n*/   /*\n*/    background-color: #d7d7d7; /*\n*/}/*\n*//*\n*/.user-content {/*\n*/    background: linear-gradient(to right,#dbdbdb,#c9c9c9 1em);/*\n*/    border-left: 2px solid #F2E5E5; /*\n*/}.list-option-group ul { /*\n*/    box-shadow: 0 0 5px #1e1e1e; /*\n*/    background-color: #bdbdbd;/*\n*/}/*\n*/header h3{    color: #e9e9e9;}/*\n*/#script-list-option-groups{    color: #ccc;}/*\n*/#script-list-option-groups li {    color: #343434;}/*\n*/ #control-panel header h3{color:#262626}  #script-info {  background-color: #d5d5d5; }    ';

document.getElementsByTagName('head')[0].appendChild(style);
