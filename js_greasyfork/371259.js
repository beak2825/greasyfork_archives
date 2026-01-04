// ==UserScript==
// @name     Fix youtube layout (by /u/pop1040)
// @description:en fixes the youtube layout
// @version  1
// @grant    none
// @author /u/pop1040
// @include      https://www.youtube.com
// @include      https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/205384
// @description fixes the youtube layout
// @downloadURL https://update.greasyfork.org/scripts/371259/Fix%20youtube%20layout%20%28by%20upop1040%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371259/Fix%20youtube%20layout%20%28by%20upop1040%29.meta.js
// ==/UserScript==

(function(){

  //for correcting on navigation to a new video
  window.addEventListener("spfdone", function(e){
    if(!document.getElementById("content").classList.contains('content-alignment')){
        document.getElementById('content').classList.add('content-alignment');
    }
  });

  //for when you load a video directly
  window.addEventListener("load", function(event) {
    if(!document.getElementById("content").classList.contains('content-alignment')){
      document.getElementById('content').classList.add('content-alignment');
    }
  });

})();