// ==UserScript==
// @name        Android Web Messages Website Dark Theme Night Mode
// @namespace   english
// @description Android Web Messages Website Dark Theme Night Mode - simple 
// @include     http*://*messages.android.com*
// @version     1.6
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371607/Android%20Web%20Messages%20Website%20Dark%20Theme%20Night%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371607/Android%20Web%20Messages%20Website%20Dark%20Theme%20Night%20Mode.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '            body, html, html body {/*\n*/    background: #232323 !important;/*\n*/    background-color: #1f1f1f !important;/*\n*/    background-image: none important;/*\n*/} .Wh4Cqb {/*\n*/  /*\n*/    background-color: #252525  !important  ;/*\n*/}.JZ9Tfd .JsUZue {/*\n*/    background-color: #2f2f2f !important  ;/*\n*/ }  .x4Tquc {/*\n*/  /*\n*/    background-color: #2f2f2f !important;/*\n*/}.kFwPee {/*\n*/    /*\n*/    background-color: #2f2f2f !important;/*\n*/}.T4LgNb {/*\n*/    /*\n*/    background-color: #2f2f2f !important;/*\n*/}.SSPGKf {/*\n*/    /*\n*/    background-color: #2f2f2f !important;/*\n*/} .JsUZue {/*\n*/    background-color: #2b2b2b !important ;/*\n*/    /*\n*/}.JpzO5d {/*\n*/    /*\n*/    filter: invert(100%)brightness(240%);/*\n*/}.JpsRoc {/*\n*/    color: #ccc;/*\n*/    /*\n*/}.I1Ogre {/*\n*/    color: #ccc;/*\n*/    /*\n*/}        ';

document.getElementsByTagName('head')[0].appendChild(style);
