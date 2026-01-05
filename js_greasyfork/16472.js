// ==UserScript==
// @name        Anidub del man
// @description Removes del man
// @namespace Stop script ogonek
// @include     http://online.anidub.com/*
// @include     https://online.anidub.com/*
// @version     1.4.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16472/Anidub%20del%20man.user.js
// @updateURL https://update.greasyfork.org/scripts/16472/Anidub%20del%20man.meta.js
// ==/UserScript==

var script = document.createElement('script'); 
script.type = "text/javascript"; 
script.innerHTML = "function ogonekstart1() {}";
document.getElementsByTagName('head')[0].appendChild(script);

var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode('.background {background: none!important;}'))
document.head.appendChild(style);

var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode('.background > script + div, .background > script ~ div:not([id]):not([class]) + div[id][class] {display:none!important}'))
document.head.appendChild(style);