// ==UserScript==
// @name        Google Contacts Website Dark Night Mode Theme
// @namespace   english
// @description Google Contacts Website Dark Night Mode Theme - flip 
// @include     http*://*contacts.google.com/*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387846/Google%20Contacts%20Website%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/387846/Google%20Contacts%20Website%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '    body  #loader{background:#fff;}    body .QkOsze {    background: #fff;} html  {  filter: invert(1)hue-rotate(180deg)contrast(0.85);}/*\n*//*\n*/body .gb_Cc.gb_Dc {/*\n*/    background-color: #fff; /*\n*/}/*\n*//*\n*/.gb_Ia .gb_z , .HfynVe , .HsJsO, .gb_3a,.gb_d .gb_m, .kGSAAb { /*\n*/    filter: invert(1)hue-rotate(180deg)contrast(1.25);/*\n*/}  /*\n*//*\n*/body .llhEMd.llhEMd {/*\n*/    background-color: rgba(210, 210, 210, 0.79);/*\n*/    /*\n*/}/*\n*//*\n*/body .g3VIld { -webkit-box-shadow: 0 12px 15px 0 rgb(255, 255, 255);/*\n*/      box-shadow: 0 12px 15px 0 rgb(255, 255, 255);}/*\n*//*\n*//*\n*//*\n*/ .gb_Fc.gb_Hc {    background-color: white  !important ; }body.gb_qe [data-ogpc] {        background-color: #fff !important ;}        ';
document.getElementsByTagName('head')[0].appendChild(style);

 


