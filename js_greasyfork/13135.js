// ==UserScript==
// @name       donanimhaber
// @namespace  https://greasyfork.org/scripts/13135-donanimhaber
// @version    0.4
// @description donanimhaber forumu için bir takım güzel işler yapar, bunun için para pul istemez.
// @match      http://*.donanimhaber.com/*
// @copyright  2015, Turkhero
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/13135/donanimhaber.user.js
// @updateURL https://update.greasyfork.org/scripts/13135/donanimhaber.meta.js
// ==/UserScript==

cakma_cerez();
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
//window.addEventListener ("load", pageFullyLoaded);

function DOM_ContentReady () {
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
}

function pageFullyLoaded () {

}

function cakma_cerez(){
  // Pop-up banner iptal
  var zaman=new Date();
  var icerik=zaman.getHours() + '.' + zaman.getMinutes() + '.' + zaman.getDay();
  document.cookie = "PageBanner" + "=" + escape(icerik);
  var date = new Date();
  date.setDate(date.getDate()+1);
  document.cookie += ("; expires=" + date.toGMTString() + "; path=./");
  // Tüm sayfayı kaplayan banner iptal
  document.cookie = "PBanner" + "=1";
  document.cookie += ("; expires=" + date.toGMTString() + "; path=./");
}