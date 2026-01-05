// ==UserScript==
// @name        Kolorowe nicki na Wykopie
// @description Koloruje nicki w serwisie Wykop.pl
// @author      Przemok
// @version     5
// @include     http://www.wykop.pl/*
// @namespace https://greasyfork.org/users/2269
// @downloadURL https://update.greasyfork.org/scripts/1779/Kolorowe%20nicki%20na%20Wykopie.user.js
// @updateURL https://update.greasyfork.org/scripts/1779/Kolorowe%20nicki%20na%20Wykopie.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.voters-list .color-0 { color:#393 !important; } .voters-list .color-1 { color:#FF5917 !important; } .voters-list .color-2 { color:#B00 !important; } .voters-list .color-3 { color:#F00 !important; } .voters-list .color-4 { color:#999 !important; } .voters-list .color-5 { color:#000 !important; } .voters-list .color-2001 { color:#3F6FA0 !important; }';
document.getElementsByTagName('head')[0].appendChild(style);