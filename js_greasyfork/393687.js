// ==UserScript==
// @name     Tiscali Notizie Video
// @namespace    StephenP
// @version      2.0
// @description  Uno script per vedere i video di Tiscali Notizie anche col blocco pubblicitario attivo, in un player HTML5, senza pubblicità e senza autoplay forzato.
// @author       StephenP
// @grant    none
// @include https://notizie.tiscali.it/*
// @include https://spettacoli.tiscali.it/*
// @include https://ambiente.tiscali.it/*
// @include https://shopping.tiscali.it/*
// @include https://motori.tiscali.it/*
// @include https://sport.tiscali.it/*
// @include https://gamesurf.tiscali.it/*
// @include https://www.milleunadonna.it/*
// @downloadURL https://update.greasyfork.org/scripts/393687/Tiscali%20Notizie%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/393687/Tiscali%20Notizie%20Video.meta.js
// ==/UserScript==
var loadedVideos=document.getElementsByClassName("video-container");
if(loadedVideos.length>0){
  var newsVideo=document.getElementsByTagName("SOURCE")[0].getAttribute("src");
  var insertPoint=loadedVideos[0].parentNode;
  loadedVideos[0].remove();
  var newPlayer = document.createElement("video");
  newPlayer.setAttribute("controls","");
  newPlayer.style.width="100%";
  var source = document.createElement("source");
  source.setAttribute("src",newsVideo);
  newPlayer.appendChild(source);
  insertPoint.appendChild(newPlayer);
}
