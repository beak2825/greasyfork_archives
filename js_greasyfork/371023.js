// ==UserScript==
// @name        NLike
// @description visible rating system for nhentai
// @version     1.0
// @license     MIT
// @author      LastDude
// @match       https://nhentai.net/*
// @exclude     https://nhentai.net/g/*/*/
// @grant	 GM.setValue
// @grant	 GM.getValue
// @icon        https://raw.githubusercontent.com/LastDude/NLikeScript/master/pictures/logoNlike.png
// @noframes
// @namespace https://greasyfork.org/users/203950
// @downloadURL https://update.greasyfork.org/scripts/371023/NLike.user.js
// @updateURL https://update.greasyfork.org/scripts/371023/NLike.meta.js
// ==/UserScript==

// Icon
let header = document.head;
let icons = document.createElement("link");
icons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
icons.rel = "stylesheet";
header.appendChild(icons);
let i = document.createElement("i");
i.className = "material-icons";
i.style.cssText = "position:fixed;top:40%;right:0%;z-index:100;font-size:2.5em;";
  
var liste = document.getElementsByClassName("gallery");
// URL
let docURL = document.URL;
let url = docURL.substring(docURL.lastIndexOf('/', docURL.lastIndexOf('/')-1)+1, docURL.length-1);

(async () => {
  var rated = await GM.getValue(url, 0);
  var star = document.createElement("i");
  star.style.cssText = "position:absolute;z-index:9;top:0%;right:0%;background-color:rgba(100, 100, 100, 0.7);border-radius:10%;font-size:3em;color:#ffca28;";
  star.className = "material-icons";
  star.innerHTML = "star";
  
  // Show actual rating
  if( rated == -1 ){
    i.innerHTML = "thumb_down_alt";
  } else if( rated == 0 ){
    i.innerHTML = "info";
  } else if( rated == 1 ) {
    i.innerHTML = "grade";
  }
  document.body.appendChild(i);
  
  // What happens onclick
  i.onclick = function() {
    if( rated == -1 ){
      rated = 0;
      i.innerHTML = "info";
      GM.setValue(url,0);
    } else if( rated == 0){
      rated = 1;
      i.innerHTML = "grade";
      GM.setValue(url,1);
      
    } else if( rated == 1){
      rated = -1;
      i.innerHTML = "thumb_down_alt";
      GM.setValue(url,-1);
    }
  };
  
  for (var h = 0; h < liste.length; h++) {
    var item = liste.item(h);
    var reference = item.firstChild.href.substring(item.firstChild.href.lastIndexOf('/', item.firstChild.href.lastIndexOf('/')-1)+1, item.firstChild.href.length-1);
    var rating = await GM.getValue(reference, 0);
    // blurring out already rated bad
    if( rating == -1){
      var image = item.getElementsByTagName("img")[0];
      image.style.cssText += "filter:blur(2px) grayscale(80%) brightness(50%)";
    // mark good rated with star
    } else if ( rating == 1){
      item.appendChild(star.cloneNode(true));
    }
  }
})();
