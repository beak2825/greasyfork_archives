// ==UserScript==
// @name        YoutubeFloodPasSTP
// @author Singles
// @version 0.00002
// @include http://www.jeuxvideo.com/forums/*

// @grant       none
// @namespace https://greasyfork.org/users/27093
// @description Pour en finir avec les putes qui postent les liens de leurs videos
// @downloadURL https://update.greasyfork.org/scripts/16183/YoutubeFloodPasSTP.user.js
// @updateURL https://update.greasyfork.org/scripts/16183/YoutubeFloodPasSTP.meta.js
// ==/UserScript==


$(document).ready(function() {

  $('.text-enrichi-forum ').find('a').each(function() {
    a=$(this).attr('href');
    var id_video = a.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/)
     if(id_video)
       {
         
      var thumb = $('<img src="//img.youtube.com/vi/'+id_video.pop()+'/0.jpg">');
       $(this).append(thumb);
        }
         
       
 
     
   
});
  
    
    });