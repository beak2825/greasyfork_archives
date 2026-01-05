// ==UserScript==
// @name        YT_Dealabs_Player
// @namespace   YT_Dealabs_Player
// @description Ajoute les vidéos YouTube sur le forum Dealabs
// @include     https://www.dealabs.com/forums/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12522/YT_Dealabs_Player.user.js
// @updateURL https://update.greasyfork.org/scripts/12522/YT_Dealabs_Player.meta.js
// ==/UserScript==
var YTEmbed = {
  invoke: function () {
    $('a[title*=\'youtu\']').each(function () {
      var title = $(this).attr('title')
      var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
      //console.log(title);    
      if (pattern.test(title)) {
        var HTMLplayer = '<iframe width="420" height="345" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
        var player = title.replace(pattern, HTMLplayer)
        //console.log(player);
      }
      $(this).prepend(player);
    })
  }
}

setTimeout(function(){
    YTEmbed.invoke();
},3000);