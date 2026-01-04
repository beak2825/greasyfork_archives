// ==UserScript==
// @name         Antyróżowy
// @namespace    std;
// @version      2
// @description  Ukrywanie postow różowych pasków, wersja działająca na mirko i głównej, benc. Nie poprawiam ilosci postow do rozwinięcia, bo nie chce mi sie.
// @author       Plutokrata GNU + Formbi
// @match        https://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372893/Antyr%C3%B3%C5%BCowy.user.js
// @updateURL https://update.greasyfork.org/scripts/372893/Antyr%C3%B3%C5%BCowy.meta.js
// ==/UserScript==

var hideGlowna = function() {
  $(".comments-stream").find(".avatar.female").each(function() {
    $(this).parents(".iC").remove();
  });
}
var hideMirko = function() {
  $(".comments-stream").find(".avatar.female").each(function() {
    if ($(this).parents(".wblock").attr("data-type") !== "entry") {
      $(this).parents(".wblock").parent().remove();
    }
    else {
      $(this).parents(".entry.iC").remove();
    }
  });
}
var hideGorace = function() {
  $(".streammini").find(".avatar.female").each(function() {
    $(this).parents(".wblock.mini").parent().remove();
  });
}
var hideBlockedAd = function() {
  $("#wpladmid").parent().remove();
}
var hide = function() {
  if (document.URL.indexOf("wykop.pl/link") > -1) {
    hideGlowna();
    hideBlockedAd();
  }
  else {
    hideMirko();
    hideGorace();
  }
}
hide();
$(document).ajaxComplete(function() {
    hide();
});