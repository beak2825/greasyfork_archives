// ==UserScript==
// @name        KissAnime AutoPlay + Permanent Server Fix
// @description Autoplays next episode and makes the server choice persistant across episodes
// @namespace   kissanimepermserver
// @include     http://kissanime.ru/Anime/*
// @include     https://kissanime.ru/Anime/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30693/KissAnime%20AutoPlay%20%2B%20Permanent%20Server%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/30693/KissAnime%20AutoPlay%20%2B%20Permanent%20Server%20Fix.meta.js
// ==/UserScript==

if(document.getElementById('selectServer')){
  var server = document.getElementById('selectServer').value;
  server = server.substring(server.indexOf('&s='));
  if(document.getElementById('btnNext')){
   document.getElementById('btnNext').parentNode.href = document.getElementById('btnNext').parentNode.href + server;
  }
  if(document.getElementById('btnPrevious')){
   document.getElementById('btnPrevious').parentNode.href = document.getElementById('btnPrevious').parentNode.href + server;
  }
}

var vidtimer = setInterval(function(){
  if(my_video_1_html5_api.ended){
    clearInterval(vidtimer);
    window.location.href = document.getElementById('btnNext').parentNode.href;
  }
}, 1000);