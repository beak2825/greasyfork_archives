// ==UserScript==
// @name        animate gifs
// @namespace   Violentmonkey Scripts
// @match       https://kohlchan.net/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/4/2022, 10:45:10 PM
// @downloadURL https://update.greasyfork.org/scripts/454271/animate%20gifs.user.js
// @updateURL https://update.greasyfork.org/scripts/454271/animate%20gifs.meta.js
// ==/UserScript==


function animateKohl(f){
    if(window.location == window.parent.location){
        if(document.readyState == "complete"){f();}
        else{document.addEventListener('readystatechange',function(){setTimeout(f,1500);});}
    }
}

animateKohl(function(){
var posts = document.getElementsByClassName("imgLink");
for (let item in posts){
  if(posts[item].href != null){
    if(posts[item].href.endsWith("gif")){
      posts[item].click();
    }
  }
}

});