// ==UserScript==
// @name        ShowUp.TV Font Changer
// @namespace   fapkamaster@gmail.com
// @description Zmienia czcionkę na showup.tv
// @include     https://showup.tv/* 
// @exclude     
// @version     0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/33443/ShowUpTV%20Font%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/33443/ShowUpTV%20Font%20Changer.meta.js
// ==/UserScript==

//Zmiana globalnej czcionki.
$("*").css("font-family","DejaVu Serif");
//Zmiana rozmiaru globalnego czcionki (zmiany zauważane co 100)
$("*").css("font-weight","500");