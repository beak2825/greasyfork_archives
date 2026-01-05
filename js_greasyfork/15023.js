// ==UserScript==
// @name         YouTubeComeback
// @version      1.0
// @description  Przywraca odtwarzacz YT
// @author       Rst
// @match        http://www.wykop.pl/*
// @namespace https://greasyfork.org/users/13380
// @downloadURL https://update.greasyfork.org/scripts/15023/YouTubeComeback.user.js
// @updateURL https://update.greasyfork.org/scripts/15023/YouTubeComeback.meta.js
// ==/UserScript==

$(function(){

   var videoID = $('.jwplayer').attr('id');
   videoID = videoID.replace('yt-','');
         
   $('.rbl-block .screen').html('<iframe width="100%" height="520" src="https://www.youtube.com/embed/'+videoID+'" frameborder="0" allowfullscreen></iframe>');
    
});