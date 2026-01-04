// ==UserScript==
// @name KissAnime Skip videos 90 seconds/skip intro
// @description Press 'L' to skip the intro when it starts. Works with rapidvideo and beta servers.
// @namespace http://tampermonkey.net/
// @include *kissanime.ru/Anime*
// @include *rapidvideo.com*
// @noframes
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/30776/KissAnime%20Skip%20videos%2090%20secondsskip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/30776/KissAnime%20Skip%20videos%2090%20secondsskip%20intro.meta.js
// ==/UserScript==

$(document).ready(function(){
  let here = document.URL
  if (here.indexOf('rapidvideo.com') > -1){
    // jwplayer already init'd, no need to pass an id/element
    jwplayer()
    window.addEventListener('keydown', function(e){
      if (e.key === 'l'){
        jwplayer().seek(jwplayer().getPosition()+90)
      }
    })
  }else{
    if (videojs) {
      // videojs needs an id/element, find it and pass it
      let v = document.getElementsByTagName('video')
      if (v.length > 0) {v = v[0]} else {return}
      videojs(v).ready(function(){
        let player = this
        window.addEventListener('keydown', function(e){
          if (e.key === 'l'){
            player.currentTime(parseInt(player.currentTime())+90)
          }
        })
      })
    }
  }
})