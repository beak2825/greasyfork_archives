// ==UserScript==
// @name         Discord Custom
// @version      0.1
// @author       Doc
// @description  Discord improvement extension
// @locale       none
// @include      https://discordapp.com/*
// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/379906/Discord%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/379906/Discord%20Custom.meta.js
// ==/UserScript==

var css = `div[class^="containerCozy"] a img {
    max-height: 140px;
    width: auto !important;
  position:relative;
}

div[class^="containerCozy"] a{
  width:auto !important;
  height:auto !important;
  display:inline-block;
}`;
var s = document.createElement('style');
s.innerHTML = css;
document.head.appendChild(s);