// ==UserScript==
// @name         Ghostbuster
// @namespace    mediavida.com
// @version      3
// @description  Caza los fantasmas y se los lleva a otra parte
// @author       autlos (Aitor)
// @include http*://mediavida.com/*
// @include http*://www.mediavida.com/*
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36082/Ghostbuster.user.js
// @updateURL https://update.greasyfork.org/scripts/36082/Ghostbuster.meta.js
// ==/UserScript==

$('.post[data-autor="PocketAces"]').css("display","none");

// This line increases in two times the efficiency of the script:
$('.post[data-autor="_PimPollo_"]').css("display","none");

// HODL this lines:
$('.post[data-autor="Fastestwat"]').css("display","none");
$('.post[data-autor="wineMan"]').css("display","none");

