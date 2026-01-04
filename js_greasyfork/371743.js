// ==UserScript==
// @name        Panthur Hosting Australia Dark Mode Night Theme
// @namespace   english
// @description Panthur Hosting Australia Dark Mode Night Theme - simple grey red 
// @include     http*://*members.panthur.com.au*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371743/Panthur%20Hosting%20Australia%20Dark%20Mode%20Night%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371743/Panthur%20Hosting%20Australia%20Dark%20Mode%20Night%20Theme.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '      .page_main_container { /*\n*/    background-color: #292929  !important ;/*\n*/}.white_block {/*\n*/    /*\n*/    background-color: #b9b9b9 !important ;/*\n*/   /*\n*/}.form-group input:not([type=checkbox]):not([type=radio]), .form-group select, .form-group .form-control {/*\n*/    /*\n*/    color: #333333  !important ;/*\n*/    /*\n*/    background-color: gainsboro  !important ;/*\n*/    border: 1px solid #797979  !important ;/*\n*/  /*\n*/}#searchresults div:last-of-type {/*\n*/    border-bottom: 1px solid #1d1d1d78 !important ;/*\n*/}#searchresults {/*\n*/   /*\n*/    background-color: #a2a2a2 !important ;/*\n*/    border-left: 1px solid #cccccc40 !important ;/*\n*/    border-right: 1px solid #cccccc36 !important ;/*\n*/    /*\n*/}.no_records {/*\n*/    border: 1px solid #676767 !important ;/*\n*/    background: #a2a2a2 !important ;/*\n*/     /*\n*/} #wrap {    background: #3e3e3e; }.main_container {/*\n*/    background-color: #b3b3b3;/*\n*/}.table_holder {/*\n*/     /*\n*/    background-color: #d6d6d6; /*\n*/}.table_holder table tbody tr:nth-child(odd) {/*\n*/    background-color: #e6e6e6;/*\n*/}.table_holder table tbody tr:last-of-type {/*\n*/    border-bottom: 1px solid #b5b5b5;/*\n*/}.table_holder table .clientareatableheading {/*\n*/    border-bottom: 2px solid #ababab;/*\n*/    background-color: #c3c3c3;/*\n*/}      ';

document.getElementsByTagName('head')[0].appendChild(style);
