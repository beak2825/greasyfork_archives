// ==UserScript==
// @name        Whogen Copyright
// @description Nothing to see here. Move along.
// @author      RandomUsername404
// @namespace   https://greasyfork.org/en/users/105361-randomusername404
// @version     1.0
// @run-at      document-end
// @include     https://whogen.miraheze.org/wiki/*
// @grant       none
// @icon         https://static.miraheze.org/whogenwiki/f/fa/Tardis.ico
// @downloadURL https://update.greasyfork.org/scripts/434314/Whogen%20Copyright.user.js
// @updateURL https://update.greasyfork.org/scripts/434314/Whogen%20Copyright.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  var splitedPics = ["/CopyrightKarenfagFace.jpg"];
  var goodBoyPics = ["https://i.imgur.com/USwACcZ.jpg"];
  var displayedPics = document.getElementsByTagName("img");

  for(var i = 0; i <= displayedPics.length; i++) {
    
    for(var t = 0; t <= goodBoyPics.length; t++) {
      if(displayedPics[i].src.includes(splitedPics[t])) {
        displayedPics[i].src = goodBoyPics[t];
        
        if(displayedPics[i].srcset != -1) {
          displayedPics[i].srcset = goodBoyPics[t];
        }
      
         if(displayedPics[i].parentNode.href.includes(splitedPics[t])) {
           //displayedPics[i].parentNode.href = goodBoyPics[t];
           displayedPics[i].parentNode.addEventListener('click', function(event) {
             event.preventDefault();
             window.open(goodBoyPics[t]); 
           });
         }
     }
   }  
  }
})