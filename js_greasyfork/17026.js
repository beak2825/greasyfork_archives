// ==UserScript==
// @name        off.net.mk
// @namespace   da
// @description disable jwplayer on off.net.mk
// @include     https://off.net.mk/* 
// @include     http://off.net.mk/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17026/offnetmk.user.js
// @updateURL https://update.greasyfork.org/scripts/17026/offnetmk.meta.js
// ==/UserScript==

for(i = 0; i < document.getElementsByClassName('statija-media').length; i++){
  jwplayer().remove();
}