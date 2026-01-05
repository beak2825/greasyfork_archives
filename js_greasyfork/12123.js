// ==UserScript==
// @name        KAT - Hide XXX Requests
// @namespace   HideRequests
// @version     1.0
// @description Hides XXX requests if you have family safe filter on
// @match       https://kat.cr/request/*
// @match       https://sandbox.kat.cr/request/*
// @downloadURL https://update.greasyfork.org/scripts/12123/KAT%20-%20Hide%20XXX%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/12123/KAT%20-%20Hide%20XXX%20Requests.meta.js
// ==/UserScript==

$('<div id="fsf" style="display:none"></div>').insertAfter(".clear");
$.get( "/settings/", function( data ) {
  $( "#fsf" ).html( data.html );
  if ($('input[name="hide_xxx"]').attr("checked") == "checked")
  {
      if (window.location.href.search("\/xxx\/") != -1) window.location.assign("https://kat.cr/request/");
      $('a[href$="/xxx/"]').remove();
      $(".request-item").each(function()
      {
          if ($(this).find(".requestBoxBody").children().eq(2).children().text() == "XXX") $(this).hide();
      });
  }
  $("#fsf").remove();
});