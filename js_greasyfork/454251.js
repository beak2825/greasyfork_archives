// ==UserScript==
// @name        Suodata tuotteet arvoa klikattaessa - Airam.fi
// @namespace   Violentmonkey Scripts
// @match       https://www.airam.fi/tuote/*
// @grant       none
// @version     1.0
// @author      -
// @description 4.11.2022 12.36.53
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454251/Suodata%20tuotteet%20arvoa%20klikattaessa%20-%20Airamfi.user.js
// @updateURL https://update.greasyfork.org/scripts/454251/Suodata%20tuotteet%20arvoa%20klikattaessa%20-%20Airamfi.meta.js
// ==/UserScript==



  $( document ).click(function(event){
    var inner = $(event.target).html();
    var th = $(event.target).attr('data-th');

    $("td[data-th='"+th+"']").each(function() {
      if ($(this).html()!=inner) $(this).parent().hide();
    });
  });