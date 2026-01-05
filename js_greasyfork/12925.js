// ==UserScript==
// @name             CDA.PL - łatwe pobieranie filmów
// @description:pl   Dodaje link, dzięki któremu możemy szybko pobrać film bez przeszukiwania kodu źródłowego.
// @include          http://www.cda.pl/video/*
// @author           Daav daav.dev@gmail.com 
// @version          2
// @grant            none
// @namespace https://greasyfork.org/users/17047
// @description Dodaje link, dzięki któremu możemy szybko pobrać film bez przeszukiwania kodu źródłowego.
// @downloadURL https://update.greasyfork.org/scripts/12925/CDAPL%20-%20%C5%82atwe%20pobieranie%20film%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/12925/CDAPL%20-%20%C5%82atwe%20pobieranie%20film%C3%B3w.meta.js
// ==/UserScript==

var title = $("meta[property='og:title']").attr('content');
if(title.length <= 0) { title = $("span[itemprop='name']").text(); } //itemprop="name"
var newDiv = '<div class="info-quality daav_downloader" style="cursor:pointer; background: #6EBC20 none repeat scroll 0 0;border: 1px solid #7CEA0E;">Pobierz</div>';

$('div#leftCol').prepend(newDiv);

$(document).on("click", "div.daav_downloader:not(.clicked)", function () { 
  var quality = $('a.quality-btn-active').text();
  $(this).append('<span style="cursor:default;"><br><br><i style="color: white;">Wybierz jakość wideo - aktualna <b style="color: white;">'+ quality +'</b>.<br>Kliknij na poniższy tytuł filmu prawym przyciskiem myszy i wybierz: Zapisz element docelowy jako..</i><br><br><a style="font-size: 14px; font-weight: bold;" class="daav_downloader" href="'+ l +'">'+ title +'</a><br><br></span>').addClass('clicked').css('cursor', 'default');
});

$(document).on("click", "a.daav_downloader", function () { 
  return false;
});