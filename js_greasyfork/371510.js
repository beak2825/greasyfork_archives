// ==UserScript==
// @name        Google Gmail sidebar invert color Dark Night Mode Theme 
// @namespace   english
// @description Google Gmail sidebar invert color Dark Night Mode Theme - currently undergoing build
// @include     http*://*mail.google.*
// @version     1.16
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371510/Google%20Gmail%20sidebar%20invert%20color%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371510/Google%20Gmail%20sidebar%20invert%20color%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                               .bq9 {     filter: invert(100%)hue-rotate(180deg)brightness(92%)  !important ;} .gb_Ra {/*\n*/    background-color: rgba(0, 0, 0, 0) !important ;/*\n*/   /*\n*/    border: 1px solid #00000000 !important ;/*\n*/   /*\n*/} #loading {    background-color: #171717 !important ;}          #loading div{filter: invert(100%)hue-rotate(180deg)contrast(150%)brightness(70%)saturate(150%);}    #loading div div,#loading div div div,#loading div div div div,#loading div div div div div {filter: none  !important ;} .z0>.L3 {/*\n*/    /*\n*/    background-color: #333 !important ;/*\n*/   /*\n*/}.z0>.L3:hover, .z0>.L3:focus {/*\n*/    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.302), 0 4px 8px 3px rgba(0, 0, 0, 0.149) !important ;/*\n*/    background-color: #000000 !important ;/*\n*/}.z0>.L3 {/*\n*/   /*\n*/    color: #cecece !important ;/*\n*/    /*\n*/}.z0>.L3:active {/*\n*/    background-color: #000000 !important ;/*\n*/} .bhZ.bym, .bhZ.bjB {    background-color: #212121 !important ;} body .ibp-main-new-ui{background:black !important;color:#787b80 !important;} body .ibp-main-new-ui:hover{background:#30303c!important;color:#ccc  !important ;} .NI2kfb {    color: #000000;}        ';
document.getElementsByTagName('head')[0].appendChild(style);



