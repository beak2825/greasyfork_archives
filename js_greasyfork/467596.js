// ==UserScript==
// @name        invert facebook messenger dark theme
// @namespace   english
// @description invert fb messenger dark theme
// @include     http*://*messenger.com*
// @include     http*://*futureme*
// @version     1.6
// @run-at document-start
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467596/invert%20facebook%20messenger%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/467596/invert%20facebook%20messenger%20dark%20theme.meta.js
// ==/UserScript==

function LocalMain2() {

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                html{filter:invert(1);}  .__fb-light-mode {   background-color: #fff !important;  color: black !important; }.x14ctfv{ color: black !important; }img{filter:invert(1);}                      ';
document.getElementsByTagName('head')[0].appendChild(style);


    // Your code goes here.
}

window.addEventListener ("load", LocalMain2, false);


LocalMain();