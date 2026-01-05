// ==UserScript==
// @name        proxerPlaylist
// @namespace   proxer.me
// @author      Dravorle
// @description Fügt Proxer.me eine Playlistfunktion für Proxer-Streams hinzu > Nur für Firefox
// @include     http://proxer.me*
// @include     http://stream.proxer.me/embed*
// @version     1.7 Fehler mit Button zum hinzufügen mehrerer Streams gefixt. Zu lange Namen werden zusätzlich ab jetzt abgesplittet
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/17428/proxerPlaylist.user.js
// @updateURL https://update.greasyfork.org/scripts/17428/proxerPlaylist.meta.js
// ==/UserScript==

var scriptName = "proxerPlaylist";
var imageLinks = ["http://puu.sh/niSDW/89f6f65979.png", "http://proxer.me/images/flag/german.gif", "http://proxer.me/images/flag/english.gif", "http://puu.sh/nic20/cb3332a76a.png"];
var elementIds = [scriptName+"_playlist", scriptName+"_open", scriptName+"_playlistContent", scriptName+"_storList", scriptName+"_storSettings", scriptName+"_innerPlaylist", scriptName+"_AddToPlaylist", scriptName+"_startButton", scriptName+"_player", scriptName+"_dimmen", scriptName+"_divSettings", scriptName+"_btnSettings"];

var start_settings = function() {
  $("div.inner").append('<h3>'+scriptName+'</h3><div id="'+elementIds[10]+'"><input type="checkbox" name="fullscreen"> Starte im Vollbild <br /><br /> <input type="button" id="'+elementIds[11]+'" value="Speichern" /> </div>');
  $("#"+elementIds[10]).css({
    "padding-left": "30px"
  });
  
  if(getSetting("fullscreen") == true) {
    $("div#"+elementIds[10]+" > input:checkbox[name='fullscreen']").prop("checked", true);
  }
  
  $("#"+elementIds[11]).on("click", function() {
    updateSetting("fullscreen", $("div#"+elementIds[10]+" > input[name='fullscreen']").prop("checked"));    
    create_message(1, 5000, scriptName+"-Einstellungen erfolgreich geändert");
  });
  
  start_proxer();
}

var start_list = function() {
  $("table#box-table-a th:contains('Status')").append('<img style="width:30px;float:right;cursor:pointer;" src="'+imageLinks[3]+'" />');
 
  $("table#box-table-a th > img").on("click", function() {
    var title = document.title.replace(" - Episoden - Proxer.Me", "");
    var lang = $(this).parent().text().substr(0, 6);
    
    var animeID = $("a:contains('Details')").attr("href").split("/")[2];
    
    //Json laden und alle Folgen (Proxer-Stream) der Sprache (lang) raussuchen
    $.getJSON( getCurrentLink()+"format=json", function( x ) {
      console.log(x);
      var count = 0;
      var J = getPlaylistObject();
      
      for(var i=0; i<x.data.length; i++) {
        if(x.data[i].types.indexOf("proxer-stream") > -1 && x.data[i].typ == lang.toLowerCase()) {
          //Proxer-Stream vorhanden, checken ob Episode bereits auf Playlist
          var bez = title+"_"+lang+"_"+x.data[i].no;
          
          if(!checkPlaylist(bez)) {
            //Zur Playlist zufügen
            addToPlaylist(bez, "check_"+animeID+"_"+x.data[i].no+"_"+lang);
            count++;
          }
        }
      }
      create_message(1, 5000, count + " Folgen zur Playlist hinzugefügt!");
      updatePlaylist();
    });
    
    
  });
  
  start_proxer();
}

//Funktion fügt der Seite ein Div hinzu, welches die Playlist anzeigen kann und regelt
var start_proxer = function() {
  $("#wrapper").after( $('<div id="'+elementIds[0]+'"> <div id="'+elementIds[1]+'"> Playlist ▲ </div> </div>') );
  $("#"+elementIds[0]).css({
    "width": "75px",
    "height": "20px",
    "background-color": "#5E5E5E",
    "display": "inline",
    "border-right": "1px solid #777777",
    "border-top": "1px solid #777777",
    "bottom": "0",
    "left": "0",
    "position": "fixed",
    "padding": "5px",
    "border-radius": "0 10px 0 0",
    "z-index": "0"
  });
  
  $("#"+elementIds[1]).css({
    "width": "100%",
    "text-align": "center",
    "cursor": "pointer"
  });
  
  $("#"+elementIds[1]).on("click", function() {
    
    if(getSetting("active")) {
      deactivatePlaylist(true);
    } else {
      activatePlaylist(true);
    }
  });
  
  if(getSetting("active")) {
     activatePlaylist();
  }
  
};

//Funktion fügt der Watch-Seite einen Button hinzu, der einen Stream zur Playlist zufügen kann
var Start_WatchSite = function() {
  $(".wMirror").append('<br /><a href="javascript:;" id="'+elementIds[6]+'" class="menu">Zur Playlist hinzufügen</a>' );
  var PS = -1;
  for(i=0; i<streams.length; i++) {
    if(streams[i].type == "proxer-stream") {
      PS = i;
    }
  }
  if(PS > -1) {
    $("#"+elementIds[6]).on("click", function() {
      var bez = $(".wName").first().text() + "_" + $(".wLanguage").first().text() + "_" + $(".wEp").first().text();
      var sid = streams[PS].code;
      if(!checkPlaylist(bez)) {
        //Zur Playlist zufügen
        addToPlaylist(bez, sid);
      } else {
        alert("Folge ist bereits auf der Playlist!");
      }
      updatePlaylist();
    });
  } else {
    $("#"+elementIds[6]).css("text-decoration", "line-through");
    $("#"+elementIds[6]).on("click", function() { alert("Diese Folge hat leider keinen Proxer-Stream!"); } );
  }
    
  start_proxer();
};

var play = function() {
	//Check what player is used
  $(document.body).prepend('<div id="'+elementIds[8]+'"> <video controls></video> </div>');
  $(document.body).prepend('<div id="'+elementIds[9]+'"></div>');
  $("#"+elementIds[8]).css({
    "width": "10px",
    "height": "10px",
    "position": "fixed",
    "top": "25%",
    "left": "50%",
    "transform": "translate(-50%, 0)",
    "background-color": "#000",
    "z-index": "5"
  });
  
  $("#"+elementIds[9]).css({
    "width": "100%",
    "height": "100%",
    "background-color": "rgb(0, 0, 0)",
    "top": "0px",
    "left": "0px",
    "position": "fixed",
    "z-index": "5",
    "opacity": "0.1"
  });
  
  var video = $("#"+elementIds[8]).find("video");
  $(video).css({
    "width": "100%",
    "height": "100%"
  });
  var player = video[0];
  
  $("#"+elementIds[9]).on("click", function() {
    //Video pausieren und derzeitige Position zwischenspeichern
    var J = getPlaylistObject();
    J.data[0].duration = player.currentTime;
    setPlaylistObject(J);
    
    $("#"+elementIds[8]).animate({width:"10px", height:"10px" },1000, function() {$("#"+elementIds[8]).remove();});
    $("#"+elementIds[9]).animate({opacity:".1"},1000, function() {activatePlaylist(true); $("#"+elementIds[9]).remove();});
  });
  
  $("#"+elementIds[8]).animate({width:"720px", height:"360px" },1000);
  $("#"+elementIds[9]).animate({opacity:".75"},1000);
  
  if(getSetting("fullscreen") == true) {
    player.mozRequestFullScreen();
  }
  
  next();
  
  video.on("ended", function() {
    var J = getPlaylistObject();
    J.data.splice(0, 1);
    setPlaylistObject(J);
    
    next();
  });
}

var next = function() {
  var J = getPlaylistObject();
  var sid = "";
  if(J.data.length > 0) {
    sid = J.data[0].sid;
  } else {
    var player = $("#"+elementIds[8]).find("video").first();
    if(document.mozFullScreen) {
      document.mozCancelFullScreen();
    }
    $("#"+elementIds[9]).trigger("click");
    return;
  }
  
  if(sid.indexOf("check_") > -1) {
    //Hier Episode im Hintergrund aufrufen und SRC aus dieser nehmen
    //Für Funktion einen ganzen Anime zuzufügen
    
    $.ajax({
      url: "http://proxer.me/watch/"+sid.substr(6).replace(new RegExp("_", 'g'), "/").toLowerCase(),
      async: false,
      success: function(data) {
         var search = $(data).find("script:contains('var streams')").text().split("\n");
         for(var i=0; i<search.length; i++) {
           if(search[i].trim().startsWith("var streams = ")) {
             var _json = JSON.parse(search[i].trim().substr(14).replace("}];", "}]"));
             for(var j=0; j<_json.length;j++) {
               if(_json[j].type == "proxer-stream") {
                 sid = _json[j].code;
                 break;
               }
             }
           }
         }
       }
    });
  }
  
  var url = "http://stream.proxer.me/embed-"+sid+"-728x504.html";
  
  checking = true;
  $("#"+elementIds[9]).append('<iframe id="check" width="1" height="1" z-index="-1" src="'+url+'">');
}

//Diese Funktion wird ausgeführt sobald next() ausgeführt wurde und ein call eines Child-Elements erhalten wurde
var next2 = function(link) {
  var J = getPlaylistObject();
  $("#check").remove();
  checking = false;
  
  var video = $("#"+elementIds[8]).find("video");
  $(video).attr("src", link);
  var player = video[0];
  
  if($(video).attr("src") !== "") {
    player.play();
    
    if(J.data[0].duration !== null) {
      player.currentTime = J.data[0].duration;
    } else {
      player.currentTime = 0;
    }
  } else {
    if(document.mozFullScreen) {
      document.mozCancelFullScreen();
    }
    $("#"+elementIds[9]).trigger("click");
    return;
  }
}

//Funktionen zum handhaben der Localstorage
function getSetting(s) {
  var jsonValue = readStorage(elementIds[4]);
  if(jsonValue != null) {
    var J = JSON.parse(jsonValue);
  } else {
    var J = new Object();
    
    var fullscreen = {name:"fullscreen", val:true};
    var active = {name:"active", val:false};
    
    J.data = [active, fullscreen];
    setSettings(J);
  }
  for(var xy=0; xy<J.data.length; xy++) {
    if(J.data[xy].name == s) {
      return J.data[xy].val;
    }
  }
  return -1;
}
function setSettings(J) {
  localStorage.setItem(elementIds[4], JSON.stringify(J));
}
function updateSetting(s, v) {
  var jsonValue = readStorage(elementIds[4]);
  var J = JSON.parse(jsonValue);
  
  for(var xy=0; xy<J.data.length; xy++) {
    if(J.data[xy].name == s) {
      J.data[xy].val = v;
    }
  }
  setSettings(J);
}
function readStorage(n) {
  return localStorage.getItem(n);
}
function getPlaylistObject() {
  var jsonValue = readStorage(elementIds[3]);
  if(jsonValue != null) {
    var J = JSON.parse(jsonValue);
  } else {
    var J = new Object();
    J.data = [];
  }
  return J;
}
function setPlaylistObject(J) {
  localStorage.setItem(elementIds[3], JSON.stringify(J));
}
function checkPlaylist(c) {
  var J = getPlaylistObject();
  var match = false;
  for(var xy=0; xy<J.data.length; xy++) {
    if(J.data[xy].bezeichnung == c) {
      match = true;
      break;
    }
  }
  return match;
}
function addToPlaylist(bez, sid) {
  var J = getPlaylistObject();
  
  var tmp = new Object();
  tmp.bezeichnung = bez;
  tmp.sid = sid;
  
  J.data.push(tmp);  
  setPlaylistObject(J);
}
function removeFromPlaylist(sid) {
  var J = getPlaylistObject();
  var index = -1;
  for(var xy=0; xy<J.data.length; xy++) {
    if(J.data[xy].sid == sid) {
      index = xy;
    }
  }
  if(index > -1) {
    J.data.splice(index, 1);
  }
  setPlaylistObject(J);
}

function activatePlaylist(animate) {
	jQuery("#"+elementIds[1]).html('Playlist &#9660;');
	jQuery("#"+elementIds[0]).append('<div id="'+elementIds[2]+'"></div>');
	var windowSize=getWindowSize();
	var height="500px";
	if(windowSize[0]<1600) {
		jQuery('#wrapper').css('margin','0');
	}
	if(windowSize[1]>1000){}
	if(animate) {
	$("#"+elementIds[0]).animate({width:"300px", height:height },1000,function() {
		insertPlaylist();
	});
	} else {
	jQuery("#"+elementIds[0]).css('width','300px');
	jQuery("#"+elementIds[0]).css('height',height);
	insertPlaylist();
	}
  updateSetting("active", true);
}

function insertPlaylist() {
	jQuery("#"+elementIds[2]).append('<div id="'+elementIds[5]+'"></div>');
  jQuery("#"+elementIds[5]).css({
    "width": "300px",
    "height": "450px",
    "overflow": "auto",
    "border-top": "1px solid #777777",
    "border-bottom": "1px solid #777777"
  });
  var J = getPlaylistObject();
  var content = "";
  if(J.data.length > 0) {
    for(i=0; i<J.data.length; i++) {
      var bez = J.data[i].bezeichnung.split("_");
      var flag = "";
      if(bez[1] == "EngSub") {
        flag = '<img style="padding-top:2px; float:left;" title="EngSub" src="'+imageLinks[2]+'"/> ';
      } else if(bez[1] == "GerSub") {
        flag = '<img style="padding-top:2px; float:left;" title="GerSub" src="'+imageLinks[1]+'"/> ';
      }
      $("#"+elementIds[5]).append( $('<p style="height:14px; text-align:center;"><span title="'+bez[0]+' '+bez[2]+'">'+flag+' '+shortenToFit(bez[0])+' '+bez[2]+'</span><img id="'+J.data[i].sid+'" title="Aus Playlist entfernen" src="'+imageLinks[0]+'" /> </p>'));
      $("img#"+J.data[i].sid).css({
        "height": "14px",
        "cursor": "pointer",
        "float": "right",
        "padding-right": "5px",
        "padding-top": "1px"
        
      });
      $("img#"+J.data[i].sid).on("click", function() {
        removeFromPlaylist($(this).attr("id"));
        $(this).parent().remove();
        if($("#"+elementIds[5]).children().length == 0) {
          $("#"+elementIds[5]).append("<p>Keine Streams in der Playlist</p>");
        }
      });
    }
  } else {
    $("#"+elementIds[5]).append("<p>Keine Streams in der Playlist</p>");
  }
  jQuery("#"+elementIds[2]).append( '<div style="text-align:center;"> <a style="cursor:pointer;" id="'+elementIds[7]+'" class="menu">Playlist starten</a> </div>' );
  
  $("#"+elementIds[7]).on("click", function() {
    if($("#"+elementIds[5]).children().first().text() == "Keine Streams in der Playlist") {
      alert("Keine Streams in der Playlist");
    } else {
      if($("#"+elementIds[8]).length > 0) {
        //Playlist bereits offen!
      } else {
        deactivatePlaylist(true);
        play();
      }
    }
  });
}

function shortenToFit(s) {
  var tmp = "";
  var x = s.split("");
  for(var xy=0; xy < x.length && xy <= 30; xy++) {
    if(xy == 30) {
      tmp += " ...";
    } else {
      tmp += x[xy];
    }
  }
  return(tmp);
}

function deactivatePlaylist(animate) {
	jQuery('#'+elementIds[1]).html('Playlist &#9650;');
	jQuery('#'+elementIds[2]).remove();
	jQuery('#wrapper').css('margin','0 auto');
	if(animate) {
		jQuery("#"+elementIds[0]).animate({width:"75px",height:"20px"},1000,function(){});
	} else {
		jQuery("#"+elementIds[0]).css('width','75px');
		jQuery("#"+elementIds[0]).css('height','20px');
	}
  updateSetting("active", false);
}

function updatePlaylist() {
  if(getSetting("active")) {
	  jQuery('#'+elementIds[5]).remove();
    jQuery('#'+elementIds[7]).remove();
    insertPlaylist();
  }
}

// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

var checking = false;
// Listen to message from child window
eventer(messageEvent,function(e) {
  if(checking) {
    next2(e.data);
  }
},false);

//Checken auf welcher Seite das Script ausgeführt wird
if(window.location.href.indexOf("proxer.me/watch") > -1) {
  //Wenn der Stream über jQuery eingebunden wird
  Start_WatchSite();
} else if(window.location.href.indexOf("stream.proxer.me/embed") > -1) {
  parent.postMessage($("video").find("source").attr("src"), "*");
} else if(window.location.href.indexOf("proxer.me/ucp?s=settings") > -1) {
  start_settings();
} else if(window.location.href.indexOf("/list") > -1) {
  start_list();
} else {
  start_proxer();
}