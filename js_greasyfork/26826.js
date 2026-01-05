// ==UserScript==
// @name        Proxer-DeleteScript
// @author      Dravorle
// @description Duuh
// @namespace   InterneProxerScripte
// @include     https://proxer.me/mcp?section=anime&s=episode&id=*
// @version     1.3 Umstieg auf primär Tampermonkey, Einbau Proxer-Sicherheitstoken
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26826/Proxer-DeleteScript.user.js
// @updateURL https://update.greasyfork.org/scripts/26826/Proxer-DeleteScript.meta.js
// ==/UserScript==

$(window).on('load', function () {
  $(window).on('ajaxProxer', function() {
      start();
  });
  start();
});

var start = function () {
  if ($('div#deleteScript').length > 0) {
    return;
  }
  var thisID = getUrlVars() ['id'];
  //Zugriff ermöglichen
  var key = '32ni3S9SdamLqP2mYfAmQuv2OoaaGTnH';
  $.ajaxSetup({
    headers: {
      'proxer-api-key': key
    },
    async: false
  });
  var allEpisodes;
  var availableLanguages;

  $.get("https://proxer.me/api/v1/info/listinfo?id="+thisID+"&limit=700", function(data) {
    allEpisodes = data.data.episodes;
    availableLanguages = data.data.lang;
  });

  var html = '<div id="deleteScript"> <select id="delSel">';
  html += '<option>Sprache wählen</option>';
  for (var i = 0; i < availableLanguages.length; i++) {
    html += '<option value="' + availableLanguages[i] + '">' + availableLanguages[i] + '</option>';
  }
  html += '</select> <div id="delHosters"></div> </div>';
  $('body').append(html);
  $('div#deleteScript').css({
    'position': 'fixed',
    'top': '125px',
    'left': '25px',
    'background-color': '#fff',
    'width': "250px",
    'height': 'auto',
    'z-index': '4',
    'text-align': 'center',
    'border-radius': '10px',
    'padding': '5px',
    'color': $("div#main").css("color"),
    'background-color': $("ul#simple-navi").css("background-color"),
    'border': "1px solid black"
  });

  $("select#delSel").on("change", function() {
    //Reset "delHosters"
    if( this.value != "Sprache wählen") {
      $("div#delHosters").html("");
      var allHosters = new Array();
      var allImages = new Array();
      var language = this.value;

      for(var i = 0; i < allEpisodes.length; i++) {
        if(allEpisodes[i].typ == language) {
          var episodenhoster = allEpisodes[i].types.split(",");
          var epImages = allEpisodes[i].typeimg.split(",");
          for(var j = 0; j < episodenhoster.length; j++) {

            //alert( $.inArray( episodenhoster[j], allHosters ) );

            if( $.inArray( episodenhoster[j], allHosters ) == -1 ) {
              allHosters.push( episodenhoster[j] );
              allImages.push( epImages[j] );
            }
          }
        }
      }

      var newHtml = '<img height="25" src="https://puu.sh/sElS6/f83d4a6cca.png" id="delAll" />';
      for(var i = 0; i < allHosters.length; i++) {
        newHtml += '<img height="25" src="/images/hoster/'+allImages[i]+'" id="'+allHosters[i]+'" />';        
      }
      
      $("div#delHosters").html(newHtml);
      //$("div#delHosters").find("img#proxer-stream").hide();      
      
      $("div#delHosters").find("img").on("click", function() {
        var hoster = $(this).prop("id");
        var lang = $("#delSel option:selected").text();
        
        if(hoster != "delAll") {
          if( confirm("Bist du sicher, dass du alle "+hoster+"-Streams in "+lang+" löschen möchtest?") ) {
            //LÖSCHEN
            for(var i = 0; i < allEpisodes.length; i++) {
              if(allEpisodes[i].typ == lang) {
                if(allEpisodes[i].types.indexOf(hoster) > -1) {
                  //Episode hat Hoster, API-Anfrage um ID zu bekommen!                  
                  $.get("https://proxer.me/api/v1/anime/proxerstreams?id="+thisID+"&episode="+allEpisodes[i].no+"&language="+lang, function(resp) {
                    for(var j = 0; j < resp.data.length; j++) {
                      if(resp.data[j].type == hoster) {
                        $.get( "https://proxer.me/uploadstream?format=json&action=delete&mid="+resp.data[j].id+"&"+$('#proxerToken').val()+'=1', function(r2) {
                          //create_message(1, 5000, r2.msg);
                          $("#row"+resp.data[j].id).hide();
                        });
                      }
                    }
                  });
                }
              }
            }
            $("div#delHosters img#"+hoster).hide();
          } else {
            //Nicht löschen!
          }
        } else {
          //ALLE LÖSCHEN
          if( confirm("Bist du sicher, dass du alle Streams in "+lang+" löschen möchtest?") ) {
            //LÖSCHEN
            for(var i = 0; i < allEpisodes.length; i++) {
              if(allEpisodes[i].typ == lang) {              
                $.get("https://proxer.me/api/v1/anime/proxerstreams?id="+thisID+"&episode="+allEpisodes[i].no+"&language="+lang, function(resp) {
                  for(var j = 0; j < resp.data.length; j++) {
                    $.get( "https://proxer.me/uploadstream?format=json&action=delete&mid="+resp.data[j].id+"&"+$('#proxerToken').val()+'=1', function(r2) {
                      //create_message(1, 5000, r2.msg);
                      $("#row"+resp.data[j].id).hide();
                    });
                  }
                });
              }
            }
          }
        }        
      });
      
    }
  });
  
};
function getUrlVars() {
  var vars = {
  };
  var parts = getCurrentLink().replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}