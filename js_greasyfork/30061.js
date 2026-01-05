// ==UserScript==
// @name           ReviveYouTube Alpha
// @namespace      ZombieModd3r77
// @description    Install this addon to access all participating youtuber's content in its pure uncensored and unmodified form!
// @author         ZombieModd3r77 (https://www.youtube.com/channel/UCI4MmXzAyBEMB_8Hwp3PFkQ)
// @oujs:author    ZombieModd3r77
// @include        http://www.youtube.com*
// @include        https://www.youtube.com*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @run-at         document-idle
// @version        6.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/30061/ReviveYouTube%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/30061/ReviveYouTube%20Alpha.meta.js
// ==/UserScript==

  {
    var videoid = window.location.search.substr(window.location.search.indexOf("v=") + 2);
    var junk = videoid.indexOf("&");
    if (junk != -1) {
    videoid = videoid.substr(0, junk);
    videoid = decodeURIComponent(videoid);
  }
}

// --------- The Pixies - Where Is My Mind (Bassnectar Remix)  (Test Video) (Copyright) -----------
//           Link: https://www.youtube.com/watch?v=a4c1ATJQXDk            //


 if(videoid == "a4c1ATJQXDk"){

    var YoutubePlayer = document.createElement('iframe');
    var FirstOperation = document.getElementById('movie_player');
    setTimeout(function() {FirstOperation.parentNode.replaceChild(YoutubePlayer, FirstOperation);}, 1000);
  {
    YoutubePlayer.height = "100%";
    YoutubePlayer.width = "100%";
    YoutubePlayer.src = "https://youtube.com/embed/?status=ok&hl=en&allow_embed=1&ps=docs&partnerid=30&autoplay=1&docid=0B68iByuWRov9bHRBUTV2R0dkU3M";
    YoutubePlayer.frameborder = "no";
    YoutubePlayer.allowfullscreen = "true";
    }
 }

//           Link: https://www.youtube.com/watch?v=a4c1ATJQXDk            //
// --------- The Pixies - Where Is My Mind (Bassnectar Remix) ------------//