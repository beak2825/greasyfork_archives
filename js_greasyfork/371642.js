// ==UserScript==
// @name        Facebook Messenger Dark Theme Night Mode
// @namespace   english
// @description Facebook Messenger Website Dark Theme Night Mode Simple 
// @include     http*://*messenger.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371642/Facebook%20Messenger%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371642/Facebook%20Messenger%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '           ._2sdm {/*\n*/    background-color: rgb(37, 37, 37);/*\n*/    -webkit-font-smoothing: antialiased;/*\n*/}._4sp8 {/*\n*/    background-color: #2d2d2d;/*\n*/   /*\n*/}._o46 {/*\n*/    /*\n*/    filter: invert(100%)hue-rotate(180deg);/*\n*/}._1ht6 {/*\n*/    color: rgb(255, 255, 255);/*\n*/     /*\n*/}body {/*\n*/   /*\n*/    color: #dadada;/*\n*/   /*\n*/}._1ht7 {/*\n*/    color: rgba(255, 255, 255, 0.4);/*\n*/   /*\n*/}._3szq {/*\n*/    color: rgb(224, 224, 224);/*\n*/    /*\n*/}._2jnv, ._2jnx, ._2jnz, ._2jnx ._30e7 ._5j5f {/*\n*/    color: rgb(243, 243, 243);/*\n*/   /*\n*/}._1lj0 {/*\n*/    /*\n*/    color: rgba(255, 255, 255, 0.4);/*\n*/     /*\n*/}._4rph ._4rpj {/*\n*/    color: rgb(224, 224, 224);/*\n*/   /*\n*/}._364g {/*\n*/    color: rgb(216, 216, 216);/*\n*/     /*\n*/}._5rh4, ._5qsj {/*\n*/    color: rgba(255, 255, 255, 0.4);/*\n*/     /*\n*/}._2y8z {/*\n*/    color: rgba(255, 255, 255, 0.4);/*\n*/     /*\n*/}._2y8_ {/*\n*/    background-color: #545454;/*\n*/   /*\n*/}._225b {/*\n*/     color: rgba(255, 255, 255, 0.4);/*\n*/ /*\n*/}._3q35 {/*\n*/    color: rgba(255, 255, 255, 0.4);/*\n*/    /*\n*/}._3q34 {/*\n*/    color: rgb(255, 255, 255);/*\n*/   /*\n*/}._2y8y {/*\n*/   /*\n*/    background: #585858;/*\n*/ /*\n*/}._14-7._14-7 ._58al {/*\n*/    /*\n*/    color: #ccc;/*\n*/} body, html, html body {/*\n*/    background: #696969 !important;/*\n*/    background-color: #636363 !important;/*\n*/    background-image: none important;/*\n*/}       ';

document.getElementsByTagName('head')[0].appendChild(style);
