// ==UserScript==
// @name        Nerdcore Musikvideo Playlist
// @namespace   http://www.nerdcore.de/
// @description erstellt automatisch eine Youtube Playlist aus den Videos im Post
// @include     http://*nerdcore.de/*
// @include     https://*nerdcore.de/*
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34944/Nerdcore%20Musikvideo%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/34944/Nerdcore%20Musikvideo%20Playlist.meta.js
// ==/UserScript==

var musikda= document.getElementsByClassName("h2-single")[0].innerHTML;
if(musikda.indexOf("usikvideos")>0){


 var divpost = document.getElementById("innerwrap");
 var ueb = divpost.getElementsByClassName("rll-youtube-player");

 var ids="";
 for (var i = 0; i < ueb.length; i++){
  var id=ueb[i].getAttribute("data-id"); //sucht Youtube Links aus jew. iframes

  var ids=ids+","+id;

 }
 var playlist = document.createElement("div");
 playlist.innerHTML = "<h4><a href=\"http://www.youtube.com/watch_videos?video_ids="+ids.substring(1)+"\" target=\"_blank\" > &#9654;Youtube-Playlist</a></h4><br>"
document.getElementsByTagName("h4")[0].insertBefore(playlist, document.getElementsByTagName("h4")[0].childNodes[0]);  //Fügt Link zur YT Playlist vor der ersten h3 Überschrift ein
console.log(playlist.innerHTML);
}
