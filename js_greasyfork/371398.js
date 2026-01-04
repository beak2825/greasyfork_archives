// ==UserScript==
// @name        Google Login Screen Dark Night Mode Theme 
// @namespace   english
// @description Google Login Screen Dark Night Mode Theme sign in with google 
// @include     http*://*accounts.google.*/signin?*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371398/Google%20Login%20Screen%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371398/Google%20Login%20Screen%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                                /*\n*/body {/*\n*//*\n*/    background: #393939;/*\n*/   /*\n*/    /*\n*/   /*\n*//*\n*/}body, input, textarea, select, button {/*\n*/    color: #ddd;/*\n*/    font-family: "PT Mono;/*\n*/}.u7land .B9IrJb {/*\n*/    color: #e0e0e0;/*\n*/}.LJtPoc {/*\n*/     background: #545454;/*\n*/ /*\n*/    -moz-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);/*\n*/    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);/*\n*/  /*\n*/}.Fmgc2c {/*\n*/    color: #cbcbcb;/*\n*/   /*\n*/}a, a:hover, a:visited, a[href].uBOgn, button[type="button"].uBOgn {/*\n*/    color: #c9ddf6;/*\n*/    /*\n*/}.xRNBsb {/*\n*/    color: #96b9f5;/*\n*/}.TnvOCe:focus {/*\n*/    background: #323232;/*\n*/ }.nDKKZc.oG5Srb {/*\n*/    color: #88b5f2;/*\n*/}.nDKKZc:hover.oG5Srb:not(.RDPZE) {/*\n*/    background: #303030;/*\n*/}.OabDMe {/*\n*/  /*\n*/    background-color: #72aaf3;/*\n*/ /*\n*/}.AxOyFc ,.snByac{color:#88b5f2 !important;}.dU0W2d {/*\n*/   /*\n*/    border-bottom: 1px solid #848484;/*\n*/    /*\n*/}                                  ';
document.getElementsByTagName('head')[0].appendChild(style);



