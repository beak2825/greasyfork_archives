// ==UserScript==
// @name        envatoStrip
// @namespace   envatoStrip
// @description stripenvato
// @include     http://codecanyon.net/item/*
// @include     http://graphicriver.net/item/*
// @version     1
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant       none
// @description:en envato
// @description envato

// @downloadURL https://update.greasyfork.org/scripts/10077/envatoStrip.user.js
// @updateURL https://update.greasyfork.org/scripts/10077/envatoStrip.meta.js
// ==/UserScript==

  console.log("greasemonkey loaded");

  jQuery(".page__canvas").hide();

  var title = jQuery(".item-header__title h1").text();
  var image = jQuery(".item-preview img").attr('src');
  //alert(title);

  jQuery(".page").append("<h1>"+title+"</h1>");
  jQuery(".page").append("<p>"+image+"</p>");

