// ==UserScript==
// @name        invert future me and keep colours  dark theme
// @namespace   english
// @description invert future me dark theme

// @include     http*://*futureme*
// @version     1.5
// @run-at document-start
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468154/invert%20future%20me%20and%20keep%20colours%20%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/468154/invert%20future%20me%20and%20keep%20colours%20%20dark%20theme.meta.js
// ==/UserScript==

function LocalMain2() {

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                html{filter: invert(1)hue-rotate(0.34turn);}html,body,p,div,i,b,strong,span,textarea.fm-editor-textarea,textarea{font-family:"STALKER1","PT Mono","Tahoma" !important ;}                   ';
document.getElementsByTagName('head')[0].appendChild(style);


    // Your code goes here.
}

window.addEventListener ("load", LocalMain2, false);


LocalMain();