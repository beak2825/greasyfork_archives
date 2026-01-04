// ==UserScript==
// @name        Google Photos Dark Theme Night Mode 
// @namespace   english
// @description Google Photos Dark Theme Night Mode - in progress
// @include     http*://*photos.google*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371616/Google%20Photos%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371616/Google%20Photos%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '               body, html, html body {/*\n*/    background: #252525 !important;/*\n*/    background-color: #252525 !important;/*\n*/    background-image: none important;/*\n*/}.xoqcGf .QtDoYb {/*\n*/   invert(100%)hue-rotate(180deg);/*\n*/}#gb#gb a.gb_b, .gb_Ab {/*\n*/   /*\n*/    filter: hue-rotate(180deg)invert(100%);/*\n*/}.DOAbib .JUQOtc {/*\n*/    -webkit-flex-shrink: 0;/*\n*/    flex-shrink: 0;/*\n*/    fill: rgba(255, 255, 255, 0.54);/*\n*/    color: rgba(255, 255, 255, 0.54);/*\n*/}.DOAbib .xMAzlb {/*\n*/    fill: rgba(255, 255, 255, 0.54);/*\n*/    color: rgba(255, 255, 255, 0.54);/*\n*/}.xA0gfb {/*\n*/    display: inline;/*\n*/    vertical-align: baseline;/*\n*/    color: rgba(255, 255, 255, 0.87);/*\n*/    font: 500 13px/20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;/*\n*/}.HrGXnb {/*\n*/     background-color: rgba(0, 0, 0, 0.7);/*\n*/    /*\n*/}.HrGXnb {/*\n*/    /*\n*/    color: rgba(255, 255, 255, 0.54);/*\n*/ /*\n*/}.KALWyc {/*\n*/     background-color: rgba(0, 0, 0, 0.7);/*\n*/   /*\n*/}.gN5aAe {/*\n*/    background: #fff0;/*\n*/    /*\n*/}.YisXab {/*\n*/    /*\n*/    background-color: #fff0;/*\n*/     /*\n*/}.YisXab::after {/*\n*/    background: #7d7d7d4d;/*\n*/    /*\n*/}.rWyLGb {/*\n*/    /*\n*/   /*\n*/    color: rgba(255, 255, 255, 0.87);/*\n*/    /*\n*/}.z7JNmd {/*\n*/    color: rgba(255, 255, 255, 0.87);/*\n*/    /*\n*/}.mfQCMe {/*\n*/    color: rgba(255, 255, 255, 0.87);/*\n*/     /*\n*/}.UV4Xae {/*\n*/   /*\n*/    color: rgba(255, 255, 255, 0.54);/*\n*/   /*\n*/}.kY0kof {/*\n*/    background: #212121;/*\n*/}.PpML1d {/*\n*/    background: #212121;/*\n*/   /*\n*/}.G6iPcb .JUQOtc {/*\n*/    /*\n*/    fill: rgba(255, 255, 255, 0.54);/*\n*/}.FBoeXc.vOSR6b {/*\n*/    background: #444;/*\n*/}.RwVyJb {/*\n*/    /*\n*/    color: #d2d2d2;/*\n*/   /*\n*/}.UcZrVc {/*\n*/    /*\n*/    fill: rgba(255, 255, 255, 0.54);/*\n*/}.QtDoYb {/*\n*/    /*\n*/    background: #212121;/*\n*/    /*\n*/}.RZWHpe {/*\n*/   /*\n*/    color: #ccc;/*\n*/}  /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}               ';

document.getElementsByTagName('head')[0].appendChild(style);
