// ==UserScript==
// @name         Embedded YouTube Player for Websites
// @namespace    http://www.example.com
// @version      0.1
// @description  Spawns a youtube player that can be resized and moved on every page.
// @author       Miles
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28080/Embedded%20YouTube%20Player%20for%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/28080/Embedded%20YouTube%20Player%20for%20Websites.meta.js
// ==/UserScript==
 (function() {

  let player = spawnB();


  function spawnB(){
    spawnA();
    var tag = document.createElement('script');
    var iDiv = document.createElement('div');
    iDiv.className = 'YouTube Player';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
       tag.src = "https://www.youtube.com/iframe_api";
       var firstScriptTag = document.getElementsByTagName('script')[0];
       firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
       var player;
       function onYouTubeIframeAPIReady() {
         player = new YT.Player('player', {
           height: '0',
           width: '0',
           videoId: prompt("URL:"),
           events: {
             'onReady': onPlayerReady
           }
         });
       }
       function onPlayerReady(event) {
         event.target.setVolume(100);
         event.target.playVideo();
       }  
  }
  
  function spawnA(){
  var tag = document.createElement('script');
  var iDiv = document.createElement('div');
  iDiv.className = 'ograndeegostosoplayeroculto';
  document.getElementsByTagName('body')[0].appendChild(iDiv);
     tag.src = "https://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
     var player;
     function onYouTubeIframeAPIReady() {
       player = new YT.Player('player', {
         height: '0',
         width: '0',
         videoId: 'Gn8GH8gOiXY',
         events: {
           'onReady': onPlayerReady
         }
       });
     }
     function onPlayerReady(event) {
       event.target.setVolume(0); /* kk ngm vai ouvir */
       event.target.playVideo();
     }
   }
   
})();