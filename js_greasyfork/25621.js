// ==UserScript==
// @name temizdonanimhaber
// @namespace Violentmonkey Scripts
// @grant none
// @description donanimhaber forumlarındaki reklamları engeller
// @description:en donanimhaber forumlarındaki reklamları engeller
// @include https://donanimhaber.com/*
// @include https://*.donanimhaber.com/*
// @include http://donanimhaber.com/*
// @include http://*.donanimhaber.com/*
// @version 0.0.1.20161212140338
// @downloadURL https://update.greasyfork.org/scripts/25621/temizdonanimhaber.user.js
// @updateURL https://update.greasyfork.org/scripts/25621/temizdonanimhaber.meta.js
// ==/UserScript==
var myVar = setInterval(myTimer, 1000);

function myTimer() {
    window.location = document.getElementById('btnpass').href
}

$(document).ready(function(){ 
  $("tr[bgcolor='#FFFFFF']").remove();
  $("tr[class='r-ustkonu']").remove();
  $("tr[class='ustkonu']").remove();
  $(".konulisteTextReklam").remove();
  $("#Table7").remove();
  $("td[width='13%'").remove();
  $("td[width='10'").remove();
  $("img[src^='http://adserve.donanimhaber'").parent().remove();
  $("a[href='/m_94015223/tm.htm']").parent().parent().parent().parent().remove();
  $("img[src='http://icon.donanimhaber.com/avantajx_buton.png']").parent().remove();
  $("img[src='http://icon.donanimhaber.com/gfbuton.png']").parent().remove();
  $(".sagtaraf").remove();
  $("div[class*='Reklam']").remove();
  $("div[class*='reklam']").remove();
});
//window.addEventListener ("load", pageFullyLoaded);
 
