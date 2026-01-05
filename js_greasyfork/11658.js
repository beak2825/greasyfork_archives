// ==UserScript==
// @name        ProxerBessereMeldungen
// @author      Dravorle
// @description Meldungen werden jetzt wie die Updates über Ajax abgefertigt
// @namespace   proxer.me
// @include     http://proxer.me/mcp?section=anime&s=reports*
// @include     https://proxer.me/mcp?section=anime&s=reports*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11658/ProxerBessereMeldungen.user.js
// @updateURL https://update.greasyfork.org/scripts/11658/ProxerBessereMeldungen.meta.js
// ==/UserScript==

$(window).on("ready", function() {
  $(window).ajaxSuccess (function () {
    startScript();
  });
  startScript();  
});

var startScript = function() {
  //Script nur ausführen, wenn es nicht bereits läuft.
  if( $("#UserScriptStarted").length === 0 ) {  
    $("div.inner").append( $("<input type='hidden' id='UserScriptStarted' value='Dravorle ist der beste! <3'/>") ); 
    
    //Jeder Zeile eine ID zuweisen um sie später mit fadeOut() zu entfernen
    $("table.details").children().children().each( function(i) {
      if(i > 0)
        {
          var link = $(this).find("a:contains('Stream in Ordnung.')").attr("href");
          var i1 = (link.indexOf("mid=") + 4);
          var l = (link.indexOf("#top") - i1);
          var sid = link.substr(i1, l);

          $(this).find("a:contains('Stream in Ordnung.')").parent().parent().attr("id", "rem"+sid); 
          $(this).attr("id", "row"+sid);          
        }
      
    });
    
    //Jedem Link ein Javascript zuweisen
    $("table.details").find("a:contains('Stream in Ordnung.')").on("click", function () {
      var sid = $(this).parent().parent().attr("id").substr(3);
      
      var ajaxLink = "/mcp?section=anime&s=reports&action=deleteReport&mid=" + sid;
      
      $.ajax({
        url: ajaxLink,  
        method: 'GET',
        cache: false,
        success: function() {
          $('#row' + sid).fadeOut();
          create_message(1, 5000, "Erfolgreich bearbeitet!");
        }
      });
    });
      
    $("table.details").find("a:contains('Stream defekt.')").on("click", function () {
      var sid = $(this).parent().parent().attr("id").substr(3);
      
      var ajaxLink = "/mcp?section=anime&s=reports&action=deleteMedium&mid=" + sid;
      
      $.ajax({
        url: ajaxLink,  
        method: 'GET',
        cache: false,
        success: function() {
          $('#row' + sid).fadeOut();
          create_message(1, 5000, "Erfolgreich gelöscht!");
        }
      });
    });
    
    //Href der Links entfernen
    $("table.details").find("a:contains('Stream in Ordnung.')").attr("href", "javascript:void(0)");
    $("table.details").find("a:contains('Stream defekt.')").attr("href", "javascript:void(0)");
  }
};