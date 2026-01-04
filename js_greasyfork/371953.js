// ==UserScript==
// @name        Google Alerts Dark Night Mode Theme (grey, not black mode) 
// @namespace   english
// @description Google Alerts Dark Night Mode Theme - currently undergoing build
// @include     http*://*google.*alerts*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371953/Google%20Alerts%20Dark%20Night%20Mode%20Theme%20%28grey%2C%20not%20black%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371953/Google%20Alerts%20Dark%20Night%20Mode%20Theme%20%28grey%2C%20not%20black%20mode%29.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                               /*\n*//*\n*/body #gb-main { /*\n*/    background: #565656!important;/*\n*/}.footer {/*\n*/   /*\n*/    background: #2f2f2f;/*\n*/    border-top: 1px solid #616161;/*\n*/  /*\n*/}body .gb_ce {/*\n*/    background-color: #616161;/*\n*/ /*\n*/}.section {/*\n*/    background: #d8d8d8;/*\n*/  /*\n*/}#main-controls .section {/*\n*/ /*\n*/    background-color: #d8d8d8;/*\n*/  /*\n*/}#main-controls #create-alert-options {/*\n*/  /*\n*/    background: #d8d8d8;/*\n*/} .goog-modalpopup-bg, .modal-dialog-bg {/*\n*/    background: #000;/*\n*/   /*\n*/}.goog-modalpopup, .modal-dialog {/*\n*/   /*\n*/    background: #d2d2d2;/*\n*/  /*\n*/}.modal-dialog-content {/*\n*/    background-color: #d2d2d2;/*\n*/  /*\n*/}    ';
document.getElementsByTagName('head')[0].appendChild(style);



